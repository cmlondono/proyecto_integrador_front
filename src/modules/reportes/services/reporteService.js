// Los reportes son PNG que genera el repo de Python; Vite los sirve en /api-reportes (ver vite.config.js)
export async function listarReportes() {
  const respuesta = await fetch('/api-reportes/lista')
  if (!respuesta.ok) throw new Error('No se pudo consultar la carpeta de reportes (¿está corriendo npm run dev?)')
  const datos = await respuesta.json()
  if (datos.error) throw new Error(datos.error)
  return datos.archivos
}

// "actualizado" en la URL obliga al navegador a pedir la imagen otra vez si el Python la sobreescribió
export function urlReporte({ archivo, actualizado }) {
  return `/api-reportes/img/${encodeURIComponent(archivo)}?v=${actualizado}`
}

// "registros_grafica_1.png" -> { grupo: "Registros", titulo: "Gráfica 1" }
export function describirReporte(archivo) {
  const partes = archivo.replace(/\.png$/i, '').split('_')
  const mayuscula = (texto) => texto.charAt(0).toUpperCase() + texto.slice(1)
  const grupo = mayuscula(partes[0])
  const resto = partes.slice(1).join(' ').replace(/grafica/i, 'Gráfica')
  return { grupo, titulo: mayuscula(resto) || grupo }
}
