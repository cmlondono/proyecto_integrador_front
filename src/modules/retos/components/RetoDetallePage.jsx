import { useState } from 'react'
import Button from '../../core/design-system/Button'
import Avatar from '../../core/design-system/Avatar'
import Chip from '../../core/design-system/Chip'
import Icono from '../../core/design-system/Icono'
import Mensaje from '../../core/components/Mensaje'
import { fechaCorta, fechaHoraCorta, textoCierre } from '../../core/utils/fechas'
import { textoArea } from '../../categorias/utils/areas'
import { usePostulaciones } from '../../registros/hooks/usePostulaciones'
import { postularse, cancelarRegistro } from '../../registros/utils/accionesRegistro'
import { ESTADOS_REGISTRO, claseEstadoRegistro, textoEstadoRegistro } from '../../registros/utils/estadosRegistro'
import PostulacionFila from '../../registros/components/PostulacionFila'
import { useDatosRetos } from '../hooks/useDatosRetos'
import { actualizarReto } from '../services/retoService'
import { claseEstadoReto } from '../utils/estadosReto'

// Junta los eventos de todas las postulaciones (postularse/aceptar/finalizar) y los
// ordena por fecha real, sin importar a cuál postulación pertenece cada uno
function actividadDelReto(registros) {
  const eventos = []
  for (const r of registros) {
    eventos.push({ id: `${r.id}-postulo`, fecha: r.fechaRegistro, nombre: r.usuario?.nombre, texto: 'se postuló.' })
    if (r.fechaAceptacion) {
      eventos.push({
        id: `${r.id}-acepto`,
        fecha: r.fechaAceptacion,
        nombre: r.aceptadoPor?.nombre,
        texto: `aceptó la postulación de ${r.usuario?.nombre}.`,
      })
    }
    if (r.fechaFinalizacion) {
      eventos.push({
        id: `${r.id}-finalizo`,
        fecha: r.fechaFinalizacion,
        nombre: r.finalizadoPor?.nombre,
        texto: `finalizó la práctica de ${r.usuario?.nombre}.`,
      })
    }
  }
  return eventos.sort((a, b) => b.fecha.localeCompare(a.fecha))
}

// Una fila de la actividad: quién hizo qué y cuándo
function FilaActividad({ nombre, texto, fecha }) {
  return (
    <div className="li">
      <Avatar nombre={nombre} tamano={28} style={{ fontSize: 11 }} />
      <div>
        <b>{nombre || 'Alguien'}</b> {texto}
        <p className="muted" style={{ fontSize: 12 }}>
          {fechaHoraCorta(fecha)}
        </p>
      </div>
    </div>
  )
}

function Dato({ icono, children }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      <Icono nombre={icono} tamano={16} />
      {children}
    </span>
  )
}

// esEstudiante: el estudiante ve el reto y se postula; CESDE y empresas lo administran
function RetoDetallePage({ id, usuario, navegar }) {
  const { retos, registros, cargando, recargar } = useDatosRetos(usuario)
  const postulaciones = usePostulaciones(recargar, usuario)
  const [pestana, setPestana] = useState('resumen')
  const [mensaje, setMensaje] = useState({ texto: '', tipo: 'exito' })

  const reto = retos.find((r) => r.id === id)
  if (cargando) return null
  if (!reto) {
    return (
      <section className="card vacio">
        No se encontró el reto. <a onClick={() => navegar('retos')}>Volver a retos</a>
      </section>
    )
  }

  const esEstudiante = usuario.rol === 'ESTUDIANTE'
  const delReto = registros
    .filter((r) => r.reto?.id === reto.id)
    .sort((a, b) => b.fechaRegistro.localeCompare(a.fechaRegistro))
  const miPostulacion = delReto.find((r) => r.usuario?.id === usuario.id)
  const enProceso = delReto.filter((r) => r.estado !== 'INSCRITO').length
  const porcentaje = delReto.length ? Math.round((enProceso / delReto.length) * 100) + '%' : '0%'
  const cerrado = reto.estado === 'Cerrado'

  async function ejecutar(accion, textoExito) {
    try {
      await accion()
      setMensaje({ texto: textoExito, tipo: 'exito' })
      await recargar()
    } catch (error) {
      setMensaje({ texto: error.message, tipo: 'error' })
    }
  }

  // Cerrar o reabrir la convocatoria cambia el estado del reto
  function cambiarConvocatoria() {
    const estado = cerrado ? 'Publicado' : 'Cerrado'
    ejecutar(
      () => actualizarReto(reto.id, { ...reto, estado, empresa: { id: reto.empresa.id }, categoria: { id: reto.categoria.id } }),
      cerrado ? 'Convocatoria reabierta' : 'Convocatoria cerrada'
    )
  }

  function alternarPostulacion() {
    if (miPostulacion) {
      ejecutar(() => cancelarRegistro(miPostulacion), 'Postulación cancelada')
    } else {
      ejecutar(() => postularse(usuario, reto, 'Postulación desde el portal'), 'Postulación enviada')
    }
  }

  const pestanas = [
    { valor: 'resumen', texto: 'Resumen' },
    ...(esEstudiante ? [] : [{ valor: 'postulaciones', texto: `Postulaciones (${delReto.length})` }]),
    { valor: 'actividad', texto: 'Actividad' },
  ]

  const textoMensaje = mensaje.texto || postulaciones.mensaje.texto
  const tipoMensaje = mensaje.texto ? mensaje.tipo : postulaciones.mensaje.tipo

  return (
    <>
      <nav aria-label="Ruta" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
        <a style={{ fontWeight: 700 }} onClick={() => navegar(esEstudiante ? 'portal' : 'retos')}>
          {esEstudiante ? 'Explorar retos' : 'Retos'}
        </a>
        <Icono nombre="siguiente" tamano={16} style={{ color: '#5A635D' }} />
        <span className="muted">{reto.nombre}</span>
      </nav>

      <Mensaje texto={textoMensaje} tipo={tipoMensaje} />

      <section className="card" style={{ padding: 24, display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'flex-start' }}>
        <Avatar nombre={reto.empresa?.nombre} cuadrado oscuro tamano={64} style={{ borderRadius: 16, fontSize: 20 }} />
        <div style={{ flex: '1 1 420px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            <Chip clase={claseEstadoReto(reto.estado)} punto>
              {reto.estado}
            </Chip>
            <span className="tag">{reto.categoria?.nombre}</span>
          </div>
          <h1>{reto.nombre}</h1>
          <div className="muted" style={{ display: 'flex', flexWrap: 'wrap', gap: 18, fontSize: 13 }}>
            <Dato icono="empresas">{reto.empresa?.nombre}</Dato>
            <Dato icono="calendario">Inicia el {fechaCorta(reto.fechaInicio)}</Dato>
            <Dato icono="calendario">Postulaciones hasta el {fechaCorta(reto.fechaFin)}</Dato>
          </div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {esEstudiante ? (
            miPostulacion && miPostulacion.estado !== 'INSCRITO' ? (
              <Chip clase={claseEstadoRegistro(miPostulacion.estado)} punto>
                {textoEstadoRegistro(miPostulacion.estado)}
              </Chip>
            ) : (
              <Button variante={miPostulacion ? 'done' : 'p'} icono={miPostulacion ? 'check' : undefined} onClick={alternarPostulacion}>
                {miPostulacion ? 'Postulación enviada' : 'Postularme'}
              </Button>
            )
          ) : (
            <>
              <Button variante="s" icono="editar" onClick={() => navegar('retoForm', { id: reto.id })}>
                Editar
              </Button>
              <Button onClick={cambiarConvocatoria}>{cerrado ? 'Reabrir convocatoria' : 'Cerrar convocatoria'}</Button>
            </>
          )}
        </div>
      </section>

      <div className="columnas">
        <section className="card col-principal">
          <div className="tabs" role="tablist">
            {pestanas.map((p) => (
              <button key={p.valor} role="tab" className={p.valor === pestana ? 'on' : ''} onClick={() => setPestana(p.valor)}>
                {p.texto}
              </button>
            ))}
          </div>

          {pestana === 'resumen' && (
            <>
              <div className="sec">
                <h2>Descripción</h2>
                <p style={{ lineHeight: 1.65, color: '#33373D' }}>{reto.descripcion}</p>
              </div>
              <div className="sec" style={{ borderTop: '1px solid #EEF1EF' }}>
                <h2>Categoría</h2>
                <div className="li">
                  <Icono nombre="check" style={{ color: '#A3195A' }} />
                  <span>
                    <b>{reto.categoria?.nombre}</b> · {reto.categoria?.descripcion}
                  </span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  <span className="tag">Área: {reto.categoria ? textoArea(reto.categoria.areaResponsable) : ''}</span>
                  <span className="tag">Sector: {reto.empresa?.sector}</span>
                </div>
              </div>
            </>
          )}

          {pestana === 'postulaciones' && (
            <>
              <div style={{ padding: '12px 20px', background: '#F8FAF9', borderBottom: '1px solid #EEF1EF' }}>
                <span className="muted" style={{ fontSize: 13 }}>
                  Más recientes primero · {enProceso} de {delReto.length} aceptadas
                </span>
              </div>
              {delReto.length === 0 && <p className="vacio">Nadie se ha postulado todavía.</p>}
              {delReto.map((registro) => (
                <PostulacionFila
                  key={registro.id}
                  registro={registro}
                  mostrarReto={false}
                  onAceptar={postulaciones.aceptar}
                  onRechazar={postulaciones.rechazar}
                  onFinalizar={postulaciones.finalizar}
                />
              ))}
            </>
          )}

          {pestana === 'actividad' && (
            <div className="sec">
              {delReto.length === 0 && <p className="muted">Sin actividad todavía.</p>}
              {actividadDelReto(delReto).map((evento) => (
                <FilaActividad key={evento.id} nombre={evento.nombre} texto={evento.texto} fecha={evento.fecha} />
              ))}
            </div>
          )}
        </section>

        <aside className="col-lateral">
          <section className="card sec">
            <h3>Postulaciones</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
              <span className="muted">Aceptadas</span>
              <b>
                {enProceso} de {delReto.length}
              </b>
            </div>
            <div className="bar">
              <span style={{ width: porcentaje }}></span>
            </div>
            {ESTADOS_REGISTRO.map((estado) => (
              <div key={estado.valor} className="kv">
                <span className="muted">{estado.texto}</span>
                <b>{delReto.filter((r) => r.estado === estado.valor).length}</b>
              </div>
            ))}
          </section>

          <section className="card sec">
            <h3>Cronograma</h3>
            <div className="kv">
              <span className="muted">Inicio</span>
              <b>{fechaCorta(reto.fechaInicio)}</b>
            </div>
            <div className="kv">
              <span className="muted">Cierre de postulaciones</span>
              <b>{fechaCorta(reto.fechaFin)}</b>
            </div>
            <div className="kv">
              <span className="muted">Estado de la convocatoria</span>
              <b>{textoCierre(reto.fechaFin)}</b>
            </div>
          </section>

          <section className="card sec">
            <h3>Contacto de la empresa</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Avatar nombre={reto.empresa?.contacto} />
              <div>
                <b>{reto.empresa?.contacto}</b>
                <p className="muted" style={{ fontSize: 12 }}>
                  Contacto · {reto.empresa?.nombre}
                </p>
              </div>
            </div>
            <div className="muted" style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
              <Dato icono="correo">{reto.empresa?.correo}</Dato>
              <Dato icono="telefono">{reto.empresa?.telefono}</Dato>
            </div>
          </section>
        </aside>
      </div>
    </>
  )
}

export default RetoDetallePage
