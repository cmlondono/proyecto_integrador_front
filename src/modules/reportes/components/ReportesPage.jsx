import { useEffect, useState } from 'react'
import Button from '../../core/design-system/Button'
import IconButton from '../../core/design-system/IconButton'
import Mensaje from '../../core/components/Mensaje'
import { listarReportes, urlReporte, describirReporte } from '../services/reporteService'

// Galería de los reportes (PNG) generados con Python. Solo la ve CESDE.
function ReportesPage() {
  const [reportes, setReportes] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [abierto, setAbierto] = useState(null)

  // Lee la carpeta y deja el resultado (o el error) en el estado
  function aplicar(promesa) {
    return promesa
      .then((lista) => {
        setReportes(lista)
        setError('')
      })
      .catch((e) => setError(e.message))
      .finally(() => setCargando(false))
  }

  useEffect(() => {
    aplicar(listarReportes())
  }, [])

  // Botón "Actualizar": vuelve a consultar qué PNG hay (por si el Python generó nuevos)
  function consultar() {
    setCargando(true)
    aplicar(listarReportes())
  }

  // Agrupa por el prefijo del archivo: registros_..., usuarios_...
  const grupos = reportes.reduce((acc, reporte) => {
    const { grupo } = describirReporte(reporte.archivo)
    ;(acc[grupo] ||= []).push(reporte)
    return acc
  }, {})

  return (
    <>
      <div className="head">
        <div className="titulo">
          <h1>Reportes</h1>
          <p className="muted">Gráficas generadas con el análisis de datos en Python.</p>
        </div>
        <Button variante="s" icono="actualizar" onClick={consultar} disabled={cargando}>
          {cargando ? 'Consultando…' : 'Actualizar'}
        </Button>
      </div>

      <Mensaje texto={error} tipo="error" />

      {!cargando && !error && reportes.length === 0 && (
        <div className="card vacio">Aún no hay reportes en la carpeta. Corre el script de Python y pulsa Actualizar.</div>
      )}

      {Object.entries(grupos).map(([grupo, lista]) => (
        <section key={grupo} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <h2>
            {grupo} <span className="muted">· {lista.length}</span>
          </h2>
          <div className="grid-tarjetas">
            {lista.map((reporte) => (
              <button key={reporte.archivo} className="card reporte" onClick={() => setAbierto(reporte)}>
                <img src={urlReporte(reporte)} alt={reporte.archivo} loading="lazy" />
                <div className="reporte-pie">
                  <b>{describirReporte(reporte.archivo).titulo}</b>
                  <span className="muted">{new Date(reporte.actualizado).toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                </div>
              </button>
            ))}
          </div>
        </section>
      ))}

      {abierto && (
        <>
          <div className="veil" onClick={() => setAbierto(null)} />
          <div className="reporte-visor" role="dialog" aria-label={abierto.archivo}>
            <div className="drawer-cabeza">
              <h2>
                {describirReporte(abierto.archivo).grupo} · {describirReporte(abierto.archivo).titulo}
              </h2>
              <IconButton icono="cerrar" etiqueta="Cerrar" onClick={() => setAbierto(null)} />
            </div>
            <img src={urlReporte(abierto)} alt={abierto.archivo} />
          </div>
        </>
      )}
    </>
  )
}

export default ReportesPage
