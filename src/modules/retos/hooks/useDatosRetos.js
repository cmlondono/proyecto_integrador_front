import { useEffect, useState } from 'react'
import { listarRetos } from '../services/retoService'
import { listarEmpresas } from '../../empresas/services/empresaService'
import { listarCategorias } from '../../categorias/services/categoriaService'
import { listarRegistros } from '../../registros/services/registroService'

async function leerTodo(empresaId) {
  const [retos, empresas, categorias, registros] = await Promise.all([
    listarRetos(empresaId),
    listarEmpresas(),
    listarCategorias(),
    listarRegistros(),
  ])
  return { retos, empresas, categorias, registros, cargando: false }
}

// Carga juntas las listas que usan las pantallas de retos, inicio y portal
// usuario: si es rol EMPRESA, los retos se filtran a los de su propia empresa
export function useDatosRetos(usuario) {
  const empresaId = usuario?.rol === 'EMPRESA' ? usuario.empresa?.id : undefined
  const [datos, setDatos] = useState({ retos: [], empresas: [], categorias: [], registros: [], cargando: true })

  useEffect(() => {
    leerTodo(empresaId).then(setDatos)
  }, [empresaId])

  async function recargar() {
    setDatos(await leerTodo(empresaId))
  }

  return { ...datos, recargar }
}
