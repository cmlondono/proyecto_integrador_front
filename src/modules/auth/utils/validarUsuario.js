import { estaVacio, esCorreoValido } from '../../core/utils/validaciones'

function validarCorreo(correo, errores) {
  if (estaVacio(correo)) {
    errores.correo = 'El correo es obligatorio'
  } else if (!esCorreoValido(correo)) {
    errores.correo = 'El correo no tiene un formato válido'
  }
}

// Mismas reglas que las anotaciones del modelo Usuario en el backend
export function validarRegistro(valores) {
  const errores = {}

  if (estaVacio(valores.nombre)) errores.nombre = 'El nombre es obligatorio'
  validarCorreo(valores.correo, errores)

  if (estaVacio(valores.contrasena)) {
    errores.contrasena = 'La contraseña es obligatoria'
  } else if (valores.contrasena.length < 6) {
    errores.contrasena = 'La contraseña debe tener mínimo 6 caracteres'
  }

  if (valores.confirmarContrasena !== undefined && valores.confirmarContrasena !== valores.contrasena) {
    errores.confirmarContrasena = 'Las contraseñas no coinciden'
  }

  if (estaVacio(valores.rol)) errores.rol = 'El rol es obligatorio'

  if (valores.rol === 'EMPRESA' && estaVacio(valores.empresaId)) {
    errores.empresaId = 'Debes elegir tu empresa'
  }

  return errores
}

export function validarLogin(valores) {
  const errores = {}

  validarCorreo(valores.correo, errores)
  if (estaVacio(valores.contrasena)) errores.contrasena = 'La contraseña es obligatoria'

  return errores
}
