import { pedir } from '../../core/lib/api'

const CLAVE_SESION = 'sesion'

// POST {API_URL}/usuario/registro   body: { nombre, correo, contrasena, rol }
export const registrar = (usuario) =>
  pedir('/usuario/registro', { method: 'POST', body: JSON.stringify(usuario) })

// GET {API_URL}/usuario/usuarios
export const listarUsuarios = () => pedir('/usuario/usuarios')

// POST {API_URL}/usuario/login   body: { correo, contrasena }
export const iniciarSesion = (correo, contrasena) =>
  pedir('/usuario/login', { method: 'POST', body: JSON.stringify({ correo, contrasena }) })

// DELETE {API_URL}/usuario/{id}
export const borrarUsuario = (id) => pedir(`/usuario/${id}`, { method: 'DELETE' })

// recordar = true: la sesión queda guardada aunque se cierre el navegador (localStorage)
// recordar = false: la sesión dura solo mientras la pestaña esté abierta (sessionStorage)
export function guardarSesion(usuario, recordar) {
  const almacen = recordar ? localStorage : sessionStorage
  almacen.setItem(CLAVE_SESION, JSON.stringify(usuario))
}

export function obtenerSesion() {
  try {
    const guardada = localStorage.getItem(CLAVE_SESION) || sessionStorage.getItem(CLAVE_SESION)
    return guardada ? JSON.parse(guardada) : null
  } catch {
    return null
  }
}

export function cerrarSesion() {
  localStorage.removeItem(CLAVE_SESION)
  sessionStorage.removeItem(CLAVE_SESION)
}
