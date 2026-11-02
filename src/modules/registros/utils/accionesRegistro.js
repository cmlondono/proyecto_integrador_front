import { fechaHoraActual } from '../../core/utils/fechas'
import { guardarRegistro, actualizarRegistro, borrarRegistro } from '../services/registroService'

// Inscribe al usuario en un reto (estado inicial INSCRITO, fecha actual)
export function postularse(usuario, reto, observacion) {
  return guardarRegistro({
    fechaRegistro: fechaHoraActual(),
    observacion,
    estado: 'INSCRITO',
    usuario: { id: usuario.id },
    reto: { id: reto.id },
  })
}

// Cambia solo el estado; el backend necesita el registro completo
// gestionadoPor: cuenta admin (CESDE o Empresa) que hizo el cambio
export function cambiarEstadoRegistro(registro, estado, gestionadoPor) {
  return actualizarRegistro(registro.id, {
    ...registro,
    estado,
    usuario: { id: registro.usuario.id },
    reto: { id: registro.reto.id },
    gestionadoPor: { id: gestionadoPor.id },
  })
}

export function cancelarRegistro(registro) {
  return borrarRegistro(registro.id)
}
