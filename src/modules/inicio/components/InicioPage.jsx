import Icono from '../../core/design-system/Icono'
import Chip from '../../core/design-system/Chip'
import Mensaje from '../../core/components/Mensaje'
import { saludo, textoCierre, diasHasta, fechaHoraCorta } from '../../core/utils/fechas'
import { plural } from '../../core/utils/texto'
import { useDatosRetos } from '../../retos/hooks/useDatosRetos'
import { esRetoActivo, claseEstadoReto } from '../../retos/utils/estadosReto'
import { usePostulaciones } from '../../registros/hooks/usePostulaciones'
import PostulacionFila from '../../registros/components/PostulacionFila'
import { calcularIndicadores, retosPorCategoria } from '../utils/calcularIndicadores'
import Indicador from './Indicador'

const accionesRapidas = [
  { pagina: 'retoForm', icono: 'mas', titulo: 'Crear reto', detalle: 'Formulario guiado', principal: true },
  { pagina: 'empresas', icono: 'empresas', titulo: 'Registrar empresa', detalle: 'NIT, sector y contacto' },
  { pagina: 'usuarios', icono: 'invitar', titulo: 'Registrar usuario', detalle: 'Por correo y rol' },
  { pagina: 'categorias', icono: 'categorias', titulo: 'Categorías', detalle: 'Ajustar catálogo' },
]

function InicioPage({ usuario, navegar }) {
  const datos = useDatosRetos(usuario)
  const { mensaje, aceptar, rechazar } = usePostulaciones(datos.recargar, usuario)
  const { retos, registros } = datos
  const acciones = usuario.rol === 'EMPRESA' ? accionesRapidas.filter((a) => a.pagina === 'retoForm') : accionesRapidas

  const indicadores = calcularIndicadores(datos)
  const categorias = retosPorCategoria(retos, datos.categorias)

  // Retos activos que cierran primero
  const atencion = retos
    .filter(esRetoActivo)
    .sort((a, b) => a.fechaFin.localeCompare(b.fechaFin))
    .slice(0, 4)

  // Postulaciones más recientes primero
  const recientes = [...registros].sort((a, b) => b.fechaRegistro.localeCompare(a.fechaRegistro)).slice(0, 4)

  function postulados(reto) {
    return registros.filter((r) => r.reto?.id === reto.id).length
  }

  return (
    <>
      <div className="head">
        <div className="titulo">
          <h1>
            {saludo()}, {usuario.nombre.split(' ')[0]}
          </h1>
          <p className="muted">Esto es lo que pasa hoy con los retos de tu sede.</p>
        </div>
      </div>

      <Mensaje texto={mensaje.texto} tipo={mensaje.tipo} />

      <div className="grid-kpi">
        <Indicador
          icono="retos"
          titulo="Retos activos"
          valor={indicadores.retosActivos}
          detalle={`${plural(indicadores.retosTotal, 'reto')} en total`}
          colorDetalle="#05603A"
        />
        <Indicador
          icono="mensaje"
          titulo="Postulaciones por revisar"
          valor={indicadores.porRevisar}
          detalle={`${indicadores.postulacionesTotal} en total`}
          colores={{ fondo: '#F9FCB6', texto: '#5B6B00' }}
          colorDetalle="#5B6B00"
        />
        <Indicador
          icono="portal"
          titulo="Estudiantes en práctica"
          valor={indicadores.estudiantesEnPractica}
          detalle={`${indicadores.finalizados} finalizadas`}
          colores={{ fondo: '#DCFAE6', texto: '#05603A' }}
        />
        <Indicador
          icono="empresas"
          titulo="Empresas aliadas"
          valor={indicadores.empresasActivas}
          detalle={`${indicadores.sectores} ${indicadores.sectores === 1 ? 'sector' : 'sectores'}`}
          colores={{ fondo: '#EFE3F7', texto: '#652D90' }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <h2>Acciones rápidas</h2>
        <div className="grid-acciones">
          {acciones.map((accion) => (
            <a key={accion.pagina} className="card qa" onClick={() => navegar(accion.pagina)}>
              <span className="kico" style={accion.principal ? { background: '#DB2771', color: '#fff' } : undefined}>
                <Icono nombre={accion.icono} />
              </span>
              <div>
                <b>{accion.titulo}</b>
                <span>{accion.detalle}</span>
              </div>
            </a>
          ))}
        </div>
      </div>

      <div className="grid-paneles">
        <section className="card">
          <div className="ch">
            <h2>Retos que requieren atención</h2>
            <a style={{ fontWeight: 700 }} onClick={() => navegar('retos')}>
              Ver todos
            </a>
          </div>
          {atencion.length === 0 && <p className="vacio">No hay retos activos.</p>}
          {atencion.map((reto) => (
            <a key={reto.id} className="row" onClick={() => navegar('retoDetalle', { id: reto.id })}>
              <Chip clase={claseEstadoReto(reto.estado)} punto>
                {reto.estado}
              </Chip>
              <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <b style={{ fontSize: 14 }}>{reto.nombre}</b>
                <span className="muted" style={{ fontSize: 13 }}>
                  {reto.empresa?.nombre} · {plural(postulados(reto), 'postulado')}
                </span>
              </div>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                  color: diasHasta(reto.fechaFin) < 7 ? '#B3360F' : '#5B6B00',
                }}
              >
                {textoCierre(reto.fechaFin)}
              </span>
              <Icono nombre="siguiente" style={{ color: '#5A635D' }} />
            </a>
          ))}
        </section>

        <section className="card">
          <div className="ch">
            <h2>Postulaciones recientes</h2>
            <span className="muted" style={{ fontSize: 13 }}>
              Decide aquí, sin salir del inicio
            </span>
          </div>
          {recientes.length === 0 && <p className="vacio">Todavía no hay postulaciones.</p>}
          {recientes.map((registro) => (
            <PostulacionFila key={registro.id} registro={registro} onAceptar={aceptar} onRechazar={rechazar} />
          ))}
        </section>

        <section className="card">
          <div className="ch">
            <h2>Retos activos por categoría</h2>
            <a style={{ fontWeight: 700 }} onClick={() => navegar('categorias')}>
              Gestionar
            </a>
          </div>
          <div style={{ padding: '4px 20px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            {categorias.length === 0 && <p className="muted">No hay retos activos.</p>}
            {categorias.map((categoria) => (
              <div key={categoria.nombre} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ fontWeight: 600 }}>{categoria.nombre}</span>
                  <b>{categoria.cantidad}</b>
                </div>
                <div className="bar">
                  <span style={{ width: categoria.porcentaje }}></span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="card">
          <div className="ch">
            <h2>Actividad reciente</h2>
          </div>
          {recientes.length === 0 && <p className="vacio">Sin actividad.</p>}
          {recientes.map((registro) => (
            <div key={registro.id} className="row" style={{ alignItems: 'flex-start' }}>
              <span
                style={{ width: 10, height: 10, borderRadius: '50%', background: '#DB2771', marginTop: 5, flex: 'none' }}
              ></span>
              <div style={{ flex: 1, fontSize: 14, lineHeight: 1.5 }}>
                <b>{registro.usuario?.nombre}</b> se postuló a «{registro.reto?.nombre}».
                <div className="muted" style={{ fontSize: 12 }}>
                  {fechaHoraCorta(registro.fechaRegistro)}
                </div>
              </div>
            </div>
          ))}
        </section>
      </div>
    </>
  )
}

export default InicioPage
