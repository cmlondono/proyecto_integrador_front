import { useState } from 'react'
import Button from '../../core/design-system/Button'
import Icono from '../../core/design-system/Icono'
import Mensaje from '../../core/components/Mensaje'
import { contieneTexto } from '../../core/utils/texto'
import { useDatosRetos } from '../../retos/hooks/useDatosRetos'
import { postularse, cancelarRegistro } from '../../registros/utils/accionesRegistro'
import RetoCard from './RetoCard'
import MiPostulacion from './MiPostulacion'

function PortalPage({ usuario, navegar }) {
  const { retos, categorias, registros, recargar } = useDatosRetos()
  const [texto, setTexto] = useState('')
  const [busqueda, setBusqueda] = useState('')
  const [categoriaId, setCategoriaId] = useState('Todos')
  const [mensaje, setMensaje] = useState({ texto: '', tipo: 'exito' })

  const esEstudiante = usuario.rol === 'ESTUDIANTE'
  const misPostulaciones = registros.filter((r) => r.usuario?.id === usuario.id)

  // En el portal solo se muestran los retos publicados
  const visibles = retos
    .filter((r) => r.estado === 'Publicado')
    .filter((r) => categoriaId === 'Todos' || r.categoria?.id === categoriaId)
    .filter(
      (r) =>
        !busqueda ||
        contieneTexto(r.nombre, busqueda) ||
        contieneTexto(r.empresa?.nombre, busqueda) ||
        contieneTexto(r.descripcion, busqueda)
    )

  function miPostulacionEn(reto) {
    return misPostulaciones.find((r) => r.reto?.id === reto.id)
  }

  async function alternarPostulacion(reto) {
    const existente = miPostulacionEn(reto)
    try {
      if (existente) {
        await cancelarRegistro(existente)
        setMensaje({ texto: 'Postulación cancelada', tipo: 'exito' })
      } else {
        await postularse(usuario, reto, 'Postulación desde el portal')
        setMensaje({ texto: `Te postulaste a «${reto.nombre}»`, tipo: 'exito' })
      }
      await recargar()
    } catch (error) {
      setMensaje({ texto: error.message, tipo: 'error' })
    }
  }

  function buscar(evento) {
    evento.preventDefault()
    setBusqueda(texto)
  }

  const chips = [{ id: 'Todos', nombre: 'Todos' }, ...categorias]

  return (
    <>
      <section className="portal-hero">
        <div style={{ maxWidth: 1240, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
          <p style={{ color: '#DB2771', fontWeight: 700 }}>Hola, {usuario.nombre.split(' ')[0]}</p>
          <h1>Encuentra el reto donde vas a crecer</h1>
          <form style={{ display: 'flex', flexWrap: 'wrap', gap: 12, maxWidth: 760 }} onSubmit={buscar}>
            <div className="portal-buscar">
              <Icono nombre="buscar" />
              <label htmlFor="qs" className="sr">
                Buscar retos
              </label>
              <input
                id="qs"
                placeholder="Busca por tema o empresa"
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
              />
            </div>
            <Button type="submit" variante="a" style={{ height: 52, padding: '0 24px' }}>
              Buscar
            </Button>
          </form>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }} role="group" aria-label="Categorías">
            {chips.map((c) => (
              <button key={c.id} className={`fchip ${categoriaId === c.id ? 'on' : ''}`} onClick={() => setCategoriaId(c.id)}>
                {c.nombre}
              </button>
            ))}
          </div>
        </div>
      </section>

      <main className="portal-main">
        <Mensaje texto={mensaje.texto} tipo={mensaje.tipo} />

        {esEstudiante && (
          <section id="postulaciones" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
              <h2>Mis postulaciones</h2>
              <span className="muted">{misPostulaciones.length} postulaciones</span>
            </div>
            {misPostulaciones.length === 0 && <p className="card vacio">Aún no te has postulado a ningún reto.</p>}
            <div className="grid-tarjetas" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))' }}>
              {misPostulaciones.map((registro) => (
                <MiPostulacion key={registro.id} registro={registro} />
              ))}
            </div>
          </section>
        )}

        <section style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
            <h2>Retos abiertos</h2>
            <span className="muted">{visibles.length} retos publicados por las empresas aliadas</span>
          </div>
          {visibles.length === 0 && <p className="card vacio">No hay retos publicados con esos filtros.</p>}
          <div className="grid-tarjetas" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 360px), 1fr))' }}>
            {visibles.map((reto) => {
              const registro = miPostulacionEn(reto)
              return (
                <RetoCard
                  key={reto.id}
                  reto={reto}
                  postulado={Boolean(registro)}
                  estadoPostulacion={registro?.estado}
                  puedePostularse={esEstudiante}
                  onPostular={() => alternarPostulacion(reto)}
                  onVerDetalle={() => navegar('retoDetalle', { id: reto.id })}
                />
              )
            })}
          </div>
        </section>
      </main>
    </>
  )
}

export default PortalPage
