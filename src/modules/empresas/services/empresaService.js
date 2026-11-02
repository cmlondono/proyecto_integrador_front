import { pedir } from '../../core/lib/api'

// GET {API_URL}/empresa/empresas
export const listarEmpresas = () => pedir('/empresa/empresas')

// GET {API_URL}/empresa/{id}
export const buscarEmpresaPorId = (id) => pedir(`/empresa/${id}`)

// POST {API_URL}/empresa   body: empresa
export const guardarEmpresa = (empresa) =>
  pedir('/empresa', { method: 'POST', body: JSON.stringify(empresa) })

// PUT {API_URL}/empresa/actualizar/{id}   body: empresa
export const actualizarEmpresa = (id, empresa) =>
  pedir(`/empresa/actualizar/${id}`, { method: 'PUT', body: JSON.stringify(empresa) })

// DELETE {API_URL}/empresa/{id}
export const borrarEmpresa = (id) => pedir(`/empresa/${id}`, { method: 'DELETE' })
