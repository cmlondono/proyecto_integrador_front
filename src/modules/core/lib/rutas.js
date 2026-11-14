import { matchPath } from 'react-router'

// Traduce los nombres de página que usa navegar(pagina, datos) a direcciones (URL) y al revés.
// Así los componentes siguen llamando navegar('retoDetalle', { id }) igual que antes.

// Arma "?clave=valor" solo con los datos que tienen valor
function consulta(datos) {
  const parametros = new URLSearchParams()
  for (const [clave, valor] of Object.entries(datos)) {
    if (valor) parametros.set(clave, valor)
  }
  const texto = parametros.toString()
  return texto ? `?${texto}` : ''
}

// navegar('retoDetalle', { id: 'abc' })  ->  '/retos/abc'
export function rutaDe(pagina, datos = {}) {
  switch (pagina) {
    case 'retos':
      return `/retos${consulta({ busqueda: datos.busqueda, empresaId: datos.empresaId })}`
    case 'retoDetalle':
      return `/retos/${datos.id}`
    case 'retoForm':
      return datos.id ? `/retos/${datos.id}/editar` : `/retos/nuevo${consulta({ empresaId: datos.empresaId })}`
    default:
      // inicio, empresas, usuarios, categorias, reportes, portal
      return `/${pagina}`
  }
}

// '/retos/abc/editar'  ->  'retoForm'   (sirve para marcar el menú y revisar permisos)
export function paginaDe(ruta) {
  if (ruta === '/retos/nuevo' || matchPath('/retos/:id/editar', ruta)) return 'retoForm'
  if (matchPath('/retos/:id', ruta)) return 'retoDetalle'
  return ruta.split('/')[1] || 'inicio'
}
