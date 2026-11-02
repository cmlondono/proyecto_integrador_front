import { useEffect, useState } from 'react'
import { listarUsuarios, registrar, borrarUsuario } from '../../auth/services/authService'
import { listarRegistros } from '../../registros/services/registroService'

// Usuarios del sistema (sin contraseña) y sus postulaciones para contarlas
export function useUsuarios() {
  const [usuarios, setUsuarios] = useState([])
  const [registros, setRegistros] = useState([])
  const [mensaje, setMensaje] = useState({ texto: '', tipo: 'exito' })

  useEffect(() => {
    listarUsuarios().then(setUsuarios)
    listarRegistros().then(setRegistros)
  }, [])

  async function crear(usuario) {
    try {
      await registrar(usuario)
      setMensaje({ texto: `Usuario ${usuario.nombre} registrado`, tipo: 'exito' })
      setUsuarios(await listarUsuarios())
      return true
    } catch (error) {
      setMensaje({ texto: error.message, tipo: 'error' })
      return false
    }
  }

  async function eliminar(usuario) {
    try {
      await borrarUsuario(usuario.id)
      setMensaje({ texto: `Usuario ${usuario.nombre} eliminado`, tipo: 'exito' })
      setUsuarios(await listarUsuarios())
    } catch (error) {
      setMensaje({ texto: error.message, tipo: 'error' })
    }
  }

  return { usuarios, registros, mensaje, crear, eliminar }
}
