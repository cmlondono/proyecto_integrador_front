import { pedir } from '../../core/lib/api'

// GET {API_URL}/categoria/categorias
export const listarCategorias = () => pedir('/categoria/categorias')

// GET {API_URL}/categoria/{id}
export const buscarCategoriaPorId = (id) => pedir(`/categoria/${id}`)

// POST {API_URL}/categoria   body: categoria
export const guardarCategoria = (categoria) =>
  pedir('/categoria', { method: 'POST', body: JSON.stringify(categoria) })

// PUT {API_URL}/categoria/actualizar/{id}   body: categoria
export const actualizarCategoria = (id, categoria) =>
  pedir(`/categoria/actualizar/${id}`, { method: 'PUT', body: JSON.stringify(categoria) })

// DELETE {API_URL}/categoria/{id}
export const borrarCategoria = (id) => pedir(`/categoria/${id}`, { method: 'DELETE' })
