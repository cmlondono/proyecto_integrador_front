import { useState } from 'react'
import Button from '../../core/design-system/Button'
import Input from '../../core/design-system/Input'
import Select from '../../core/design-system/Select'
import TextArea from '../../core/design-system/TextArea'
import Avatar from '../../core/design-system/Avatar'
import Chip from '../../core/design-system/Chip'
import Icono from '../../core/design-system/Icono'
import Mensaje from '../../core/components/Mensaje'
import { useFormulario } from '../../core/hooks/useFormulario'
import { fechaCorta } from '../../core/utils/fechas'
import { useDatosRetos } from '../hooks/useDatosRetos'
import { guardarReto, actualizarReto } from '../services/retoService'
import { retoInicial, aReto, aFormulario } from '../states/retoInicial'
import { validarReto } from '../utils/validarReto'
import { ESTADOS_RETO, claseEstadoReto } from '../utils/estadosReto'

function Requisito({ cumplido, children }) {
  return (
    <div className="chk">
      <span className={cumplido ? 'ok' : ''}>
        <Icono nombre="check" tamano={14} />
      </span>
      {children}
    </div>
  )
}

function RetoFormulario({ reto, empresaInicialId, empresas, categorias, usuario, navegar }) {
  const esEmpresa = usuario.rol === 'EMPRESA'
  const empresaFija = esEmpresa ? usuario.empresa?.id : null
  const inicial = reto ? aFormulario(reto) : { ...retoInicial, empresaId: empresaFija || empresaInicialId || '' }
  const { valores, setValores, cambiar } = useFormulario(inicial)
  const [errores, setErrores] = useState({})
  const [error, setError] = useState('')

  const empresa = empresas.find((e) => e.id === valores.empresaId)
  const categoria = categorias.find((c) => c.id === valores.categoriaId)

  function elegir(campo, valor) {
    setValores({ ...valores, [campo]: valor })
  }

  async function enviar(evento) {
    evento.preventDefault()
    const erroresEncontrados = validarReto(valores)
    setErrores(erroresEncontrados)
    if (Object.keys(erroresEncontrados).length > 0) return

    try {
      const guardado = reto ? await actualizarReto(reto.id, aReto(valores)) : await guardarReto(aReto(valores))
      navegar('retoDetalle', { id: guardado.id })
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <>
      <div className="titulo">
        <h1>{reto ? 'Editar reto' : 'Publica un nuevo reto'}</h1>
        <p className="muted">Un solo formulario. Lo que escribas se ve a la derecha tal como lo verán los estudiantes.</p>
      </div>

      <Mensaje texto={error} tipo="error" />

      <div className="columnas">
        <form className="form-reto col-principal" onSubmit={enviar} noValidate>
          <section className="card sec">
            <h2 className="paso">
              <span>1</span>Información básica
            </h2>
            <Input
              etiqueta="Título del reto"
              nombre="nombre"
              value={valores.nombre}
              onChange={cambiar}
              placeholder="Ej.: Plataforma de seguimiento de pedidos"
              ayuda="Usa un verbo o resultado concreto."
              error={errores.nombre}
            />
            <div className="fila-campos">
              {esEmpresa ? (
                <Input etiqueta="Empresa" value={empresa ? empresa.nombre : ''} disabled />
              ) : (
                <Select
                  etiqueta="Empresa"
                  nombre="empresaId"
                  opciones={empresas.map((e) => ({ valor: e.id, texto: e.nombre }))}
                  value={valores.empresaId}
                  onChange={cambiar}
                  error={errores.empresaId}
                />
              )}
              <Input etiqueta="Persona de contacto" nombre="contacto" value={empresa ? empresa.contacto : ''} disabled />
            </div>
            <TextArea
              etiqueta="Descripción del problema"
              nombre="descripcion"
              value={valores.descripcion}
              onChange={cambiar}
              placeholder="¿Qué problema tiene la empresa hoy y qué resultado espera del equipo de estudiantes?"
              error={errores.descripcion}
            />
          </section>

          <section className="card sec">
            <h2 className="paso">
              <span>2</span>Clasificación
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <span className="lbl">Categoría</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {categorias.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    className={`pick ${valores.categoriaId === c.id ? 'on' : ''}`}
                    onClick={() => elegir('categoriaId', c.id)}
                  >
                    {c.nombre}
                  </button>
                ))}
              </div>
              {errores.categoriaId && <span className="error">{errores.categoriaId}</span>}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <span className="lbl">Estado</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {ESTADOS_RETO.map((e) => (
                  <button
                    key={e.valor}
                    type="button"
                    className={`prio ${valores.estado === e.valor ? 'on' : ''}`}
                    onClick={() => elegir('estado', e.valor)}
                  >
                    <Chip clase={e.clase} punto>
                      {e.valor}
                    </Chip>
                    <small>{e.descripcion}</small>
                  </button>
                ))}
              </div>
              {errores.estado && <span className="error">{errores.estado}</span>}
            </div>
          </section>

          <section className="card sec">
            <h2 className="paso">
              <span>3</span>Fechas
            </h2>
            <div className="fila-campos">
              <Input
                etiqueta="Fecha de inicio"
                nombre="fechaInicio"
                type="date"
                value={valores.fechaInicio}
                onChange={cambiar}
                error={errores.fechaInicio}
              />
              <Input
                etiqueta="Fecha de cierre"
                nombre="fechaFin"
                type="date"
                value={valores.fechaFin}
                onChange={cambiar}
                error={errores.fechaFin}
              />
            </div>
          </section>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <Button variante="s" onClick={() => navegar(reto ? 'retoDetalle' : 'retos', reto ? { id: reto.id } : {})}>
              Cancelar
            </Button>
            <Button type="submit">{reto ? 'Guardar cambios' : 'Publicar reto'}</Button>
          </div>
        </form>

        <aside className="col-lateral" style={{ flexBasis: 340 }}>
          <p className="lbl muted" style={{ textTransform: 'uppercase', letterSpacing: '.06em', fontSize: 11 }}>
            Vista previa para estudiantes
          </p>
          <article className="card tarjeta" style={{ gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Avatar nombre={empresa ? empresa.nombre : '?'} cuadrado oscuro />
              <div>
                <b style={{ fontSize: 13 }}>{empresa ? empresa.nombre : 'Empresa'}</b>
                <p className="muted" style={{ fontSize: 12 }}>
                  {categoria ? categoria.nombre : 'Categoría'}
                </p>
              </div>
            </div>
            <h3 style={{ fontSize: 18, lineHeight: 1.35 }}>{valores.nombre || 'Título del reto'}</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              <Chip clase={claseEstadoReto(valores.estado)} punto>
                {valores.estado}
              </Chip>
              {valores.fechaFin && <span className="tag">Cierra {fechaCorta(valores.fechaFin)}</span>}
            </div>
            <span className="btn btn-p" style={{ pointerEvents: 'none' }}>
              Postularme
            </span>
          </article>
          <section className="card sec">
            <b>Listo para publicar</b>
            <Requisito cumplido={valores.nombre.trim().length > 8}>Título claro</Requisito>
            <Requisito cumplido={Boolean(valores.empresaId && valores.categoriaId)}>Empresa y categoría</Requisito>
            <Requisito cumplido={Boolean(valores.fechaInicio && valores.fechaFin && valores.fechaFin >= valores.fechaInicio)}>
              Fechas válidas
            </Requisito>
            <Requisito cumplido={valores.descripcion.trim().length >= 30}>Descripción (mín. 30 caracteres)</Requisito>
          </section>
        </aside>
      </div>
    </>
  )
}

// id: reto a editar (si no viene, se crea uno nuevo). empresaId: empresa elegida de entrada
function RetoFormPage({ id, empresaId, usuario, navegar }) {
  const { retos, empresas, categorias, cargando } = useDatosRetos(usuario)
  if (cargando) return null

  const reto = id ? retos.find((r) => r.id === id) : null
  return (
    <RetoFormulario
      reto={reto}
      empresaInicialId={empresaId}
      empresas={empresas}
      categorias={categorias}
      usuario={usuario}
      navegar={navegar}
    />
  )
}

export default RetoFormPage
