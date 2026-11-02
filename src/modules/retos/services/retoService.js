import { API_URL } from '../../core/lib/api'

// --- IMPORTS LOCALSTORAGE (ya no se usan) ---
// import { leerLista, guardarLista, inicializarLista } from '../../core/lib/almacenamiento'
// import { generarId } from '../../core/utils/generarId'
// import { retosEjemplo } from '../lib/retosEjemplo'

// Las funciones son async para que se usen igual que un fetch.
// El reto se envía así: { ..., empresa: { id }, categoria: { id } }

// --- CONSTANTES LOCALSTORAGE (ya no se usan) ---
// const CLAVE = 'retos'
// const CLAVE_EMPRESAS = 'empresas'
// const CLAVE_CATEGORIAS = 'categorias'
// const CLAVE_REGISTROS = 'registros'

// inicializarLista(CLAVE, retosEjemplo)

// --- HELPER LOCALSTORAGE (ya no se usa) ---
// function completarRelaciones(reto) {
//   const empresa = leerLista(CLAVE_EMPRESAS).find((e) => e.id === reto.empresa?.id)
//   if (!empresa) throw new Error('Empresa no encontrada')
//   const categoria = leerLista(CLAVE_CATEGORIAS).find((c) => c.id === reto.categoria?.id)
//   if (!categoria) throw new Error('Categoria no encontrada')
//   return { ...reto, empresa, categoria }
// }

const BASE = `${API_URL}/reto`

async function manejarRespuesta(res) {
  if (!res.ok) {
    const mensaje = await res.text()
    throw new Error(mensaje || `Error ${res.status}`)
  }
  return res.json()
}

// GET /reto?empresaId=   empresaId: opcional, filtra los retos de una sola empresa
export async function listarRetos(empresaId) {
  // --- LOCALSTORAGE ---
  // const empresas = leerLista(CLAVE_EMPRESAS)
  // const categorias = leerLista(CLAVE_CATEGORIAS)
  // return leerLista(CLAVE).map((r) => ({
  //   ...r,
  //   empresa: empresas.find((e) => e.id === r.empresa?.id) || r.empresa,
  //   categoria: categorias.find((c) => c.id === r.categoria?.id) || r.categoria,
  // }))
  const res = await fetch(empresaId ? `${BASE}?empresaId=${empresaId}` : BASE)
  return manejarRespuesta(res)
}

// GET /reto/{id}
export async function buscarRetoPorId(id) {
  // --- LOCALSTORAGE ---
  // const reto = leerLista(CLAVE).find((r) => r.id === id)
  // if (!reto) throw new Error('Reto no encontrado')
  // return reto
  const res = await fetch(`${BASE}/${id}`)
  return manejarRespuesta(res)
}

// POST /reto   body: reto
export async function guardarReto(reto) {
  // --- LOCALSTORAGE ---
  // const nuevo = completarRelaciones({ ...reto, id: generarId() })
  // guardarLista(CLAVE, [...leerLista(CLAVE), nuevo])
  // return nuevo
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reto),
  })
  return manejarRespuesta(res)
}

// PUT /reto/{id}   body: reto
export async function actualizarReto(id, reto) {
  // --- LOCALSTORAGE ---
  // const lista = leerLista(CLAVE)
  // if (!lista.some((r) => r.id === id)) throw new Error('Reto no encontrado')
  // const actualizado = completarRelaciones({ ...reto, id })
  // guardarLista(CLAVE, lista.map((r) => (r.id === id ? actualizado : r)))
  // return actualizado
  const res = await fetch(`${BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reto),
  })
  return manejarRespuesta(res)
}

// DELETE /reto/{id}
export async function borrarReto(id) {
  // --- LOCALSTORAGE ---
  // const lista = leerLista(CLAVE)
  // if (!lista.some((r) => r.id === id)) throw new Error('Reto no encontrado')
  // const tieneRegistros = leerLista(CLAVE_REGISTROS).some((r) => r.reto?.id === id)
  // if (tieneRegistros) throw new Error('El reto tiene registros asociados')
  // guardarLista(CLAVE, lista.filter((r) => r.id !== id))
  // return 'Se ha borrado con exito'
  const res = await fetch(`${BASE}/${id}`, { method: 'DELETE' })
  if (!res.ok) {
    const mensaje = await res.text()
    throw new Error(mensaje || `Error ${res.status}`)
  }
  return res.text()
}
