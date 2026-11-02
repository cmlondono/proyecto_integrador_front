import { useState } from 'react'
import { cambiarEstadoRegistro, cancelarRegistro } from '../utils/accionesRegistro'

// Aceptar / rechazar / finalizar postulaciones.
// recargar: vuelve a leer los datos de la pantalla. usuarioActual: quién gestiona (queda en la Actividad)
export function usePostulaciones(recargar, usuarioActual) {
  const [mensaje, setMensaje] = useState({ texto: '', tipo: 'exito' })

  async function ejecutar(accion, textoExito) {
    try {
      await accion()
      setMensaje({ texto: textoExito, tipo: 'exito' })
      await recargar()
    } catch (error) {
      setMensaje({ texto: error.message, tipo: 'error' })
    }
  }

  function aceptar(registro) {
    return ejecutar(() => cambiarEstadoRegistro(registro, 'EN_PROCESO', usuarioActual), 'Postulación aceptada')
  }

  function finalizar(registro) {
    return ejecutar(() => cambiarEstadoRegistro(registro, 'FINALIZADO', usuarioActual), 'Práctica finalizada')
  }

  // El backend no tiene estado "rechazado": rechazar elimina la inscripción
  function rechazar(registro) {
    if (!window.confirm(`¿Rechazar la postulación de ${registro.usuario?.nombre}? Se eliminará la inscripción.`)) return
    return ejecutar(() => cancelarRegistro(registro), 'Postulación rechazada')
  }

  return { mensaje, setMensaje, aceptar, finalizar, rechazar }
}
