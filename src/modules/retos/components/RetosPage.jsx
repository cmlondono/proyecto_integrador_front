import { useState } from 'react'
import Button from '../../core/design-system/Button'
import IconButton from '../../core/design-system/IconButton'
import Avatar from '../../core/design-system/Avatar'
import Chip from '../../core/design-system/Chip'
import Segmento from '../../core/design-system/Segmento'
import Mensaje from '../../core/components/Mensaje'
import { fechaCorta } from '../../core/utils/fechas'
import { contieneTexto, plural } from '../../core/utils/texto'
import { useDatosRetos } from '../hooks/useDatosRetos'
import { borrarReto } from '../services/retoService'
import { ESTADOS_RETO, claseEstadoReto } from '../utils/estadosReto'

// filtrosIniciales: { busqueda, empresaId } cuando se llega desde la búsqueda o desde una empresa
function RetosPage({ navegar, filtrosIniciales = {}, usuario }) {
  const { retos, empresas, categorias, registros, recargar } = useDatosRetos(usuario)
  const [estado, setEstado] = useState('Todos')
  const [categoriaId, setCategoriaId] = useState('')
  const [empresaId, setEmpresaId] = useState(filtrosIniciales.empresaId || '')
  const [busqueda, setBusqueda] = useState(filtrosIniciales.busqueda || '')
  const [mensaje, setMensaje] = useState({ texto: '', tipo: 'exito' })

  // Pestañas con la cantidad de retos de cada estado
  const pestanas = [
    { valor: 'Todos', texto: 'Todos', cantidad: retos.length },
    ...ESTADOS_RETO.map((e) => ({
      valor: e.valor,
      texto: e.plural,
      cantidad: retos.filter((r) => r.estado === e.valor).length,
    })),
  ]

  const filtrados = retos
    .filter((r) => estado === 'Todos' || r.estado === estado)
    .filter((r) => !categoriaId || r.categoria?.id === categoriaId)
    .filter((r) => !empresaId || r.empresa?.id === empresaId)
    .filter(
      (r) =>
        !busqueda ||
        contieneTexto(r.nombre, busqueda) ||
        contieneTexto(r.empresa?.nombre, busqueda) ||
        contieneTexto(r.categoria?.nombre, busqueda)
    )
    .sort((a, b) => a.fechaFin.localeCompare(b.fechaFin))

  function postulados(reto) {
    return registros.filter((r) => r.reto?.id === reto.id).length
  }

  async function eliminar(reto) {
    if (!window.confirm(`¿Eliminar el reto «${reto.nombre}»?`)) return
    try {
      await borrarReto(reto.id)
      setMensaje({ texto: 'Reto eliminado', tipo: 'exito' })
      await recargar()
    } catch (error) {
      setMensaje({ texto: error.message, tipo: 'error' })
    }
  }

  return (
    <>
      <div className="head">
        <div className="titulo">
          <h1>Retos</h1>
          <p className="muted">Todos los retos publicados por las empresas aliadas.</p>
        </div>
        <Button icono="mas" onClick={() => navegar('retoForm')}>
          Nuevo reto
        </Button>
      </div>

      <Segmento opciones={pestanas} valor={estado} onCambiar={setEstado} etiqueta="Estado" />

      <Mensaje texto={mensaje.texto} tipo={mensaje.tipo} />

      <section className="card">
        <div className="filtros">
          <label htmlFor="fb" className="sr">
            Buscar
          </label>
          <input
            id="fb"
            className="inp"
            placeholder="Buscar por nombre"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <label htmlFor="fc" className="sr">
            Categoría
          </label>
          <select id="fc" className="inp" value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)}>
            <option value="">Todas las categorías</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
          <label htmlFor="fe" className="sr">
            Empresa
          </label>
          <select id="fe" className="inp" value={empresaId} onChange={(e) => setEmpresaId(e.target.value)}>
            <option value="">Todas las empresas</option>
            {empresas.map((e) => (
              <option key={e.id} value={e.id}>
                {e.nombre}
              </option>
            ))}
          </select>
          <span className="muted" style={{ marginLeft: 'auto', fontSize: 13 }}>
            {plural(filtrados.length, 'resultado')} · ordenados por fecha de cierre
          </span>
        </div>

        <div className="tblbox">
          <table className="tbl">
            <thead>
              <tr>
                <th>Reto</th>
                <th>Categoría</th>
                <th>Postulados</th>
                <th>Inicio</th>
                <th>Cierre</th>
                <th>Estado</th>
                <th>
                  <span className="sr">Acciones</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map((reto) => (
                <tr key={reto.id}>
                  <td>
                    <a
                      onClick={() => navegar('retoDetalle', { id: reto.id })}
                      style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#15151B' }}
                    >
                      <Avatar nombre={reto.empresa?.nombre} cuadrado oscuro tamano={36} />
                      <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <b>{reto.nombre}</b>
                        <span className="muted" style={{ fontSize: 13 }}>
                          {reto.empresa?.nombre}
                        </span>
                      </span>
                    </a>
                  </td>
                  <td>{reto.categoria?.nombre}</td>
                  <td>
                    <b>{postulados(reto)}</b>
                  </td>
                  <td>{fechaCorta(reto.fechaInicio)}</td>
                  <td>{fechaCorta(reto.fechaFin)}</td>
                  <td>
                    <Chip clase={claseEstadoReto(reto.estado)}>{reto.estado}</Chip>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: 6 }}>
                      <IconButton icono="ver" etiqueta="Ver reto" onClick={() => navegar('retoDetalle', { id: reto.id })} />
                      <IconButton icono="editar" etiqueta="Editar reto" onClick={() => navegar('retoForm', { id: reto.id })} />
                      <IconButton icono="borrar" etiqueta="Eliminar reto" variante="no" onClick={() => eliminar(reto)} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtrados.length === 0 && <p className="vacio">No hay retos con esos filtros.</p>}
        </div>
      </section>
    </>
  )
}

export default RetosPage
