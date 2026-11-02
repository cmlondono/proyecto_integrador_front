// URL base del backend (Spring Boot).
// Se usa cuando los services cambien de localStorage a fetch.
export const API_URL = 'http://localhost:8080/api/v1'

// Hace el fetch, lanza el mensaje de error del backend y devuelve el JSON (o null si no hay cuerpo)
export async function pedir(ruta, opciones = {}) {
  const respuesta = await fetch(`${API_URL}${ruta}`, {
    headers: { 'Content-Type': 'application/json' },
    ...opciones,
  })
  if (!respuesta.ok) {
    let mensaje = 'Ocurrió un error'
    try {
      const cuerpo = await respuesta.json()
      mensaje = cuerpo.message || cuerpo.error || mensaje
    } catch {
      // sin cuerpo JSON
    }
    throw new Error(mensaje)
  }
  const texto = await respuesta.text()
  if (!texto) return null
  // Algunos endpoints (ej. los DELETE) devuelven texto plano, no JSON
  try {
    return JSON.parse(texto)
  } catch {
    return texto
  }
}
