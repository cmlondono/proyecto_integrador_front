import { pedir } from '../../core/lib/api'

// GET {API_URL}/registro/registros
export const listarRegistros = () => pedir('/registro/registros')

// GET {API_URL}/registro/{id}
export const buscarRegistroPorId = (id) => pedir(`/registro/${id}`)

// POST {API_URL}/registro   body: registro
export const guardarRegistro = (registro) =>
  pedir('/registro', { method: 'POST', body: JSON.stringify(registro) })

// PUT {API_URL}/registro/actualizar/{id}   body: registro
export const actualizarRegistro = (id, registro) =>
  pedir(`/registro/actualizar/${id}`, { method: 'PUT', body: JSON.stringify(registro) })

// DELETE {API_URL}/registro/{id}
export const borrarRegistro = (id) => pedir(`/registro/${id}`, { method: 'DELETE' })
