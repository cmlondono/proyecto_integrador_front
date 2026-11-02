// Modelo Usuario del backend:
// id: UUID (string), nombre: String, correo: String (único),
// contrasena: String (mínimo 6, el backend la cifra y nunca la devuelve), rol: enum ROLES
// El rol se elige con el selector Empresa / Estudiante / CESDE de la pantalla de ingreso.
export const registroInicial = {
  nombre: '',
  correo: '',
  contrasena: '',
  confirmarContrasena: '',
  empresaId: '',
}

// Datos del login (LoginRequest en el backend). "recordar" solo se usa en el front.
export const loginInicial = {
  correo: '',
  contrasena: '',
  recordar: true,
}
