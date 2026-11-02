import { useState } from 'react'
import Button from '../../core/design-system/Button'
import Input from '../../core/design-system/Input'
import Select from '../../core/design-system/Select'
import { useFormulario } from '../../core/hooks/useFormulario'
import { registroInicial } from '../states/usuarioInicial'
import { validarRegistro } from '../utils/validarUsuario'

// rol: el elegido en el selector Empresa / Estudiante / CESDE
// empresas: lista de empresas existentes (solo se usa si rol === 'EMPRESA')
function RegistroForm({ rol, empresas = [], onRegistrar }) {
  const { valores, cambiar } = useFormulario(registroInicial)
  const [errores, setErrores] = useState({})

  function enviar(evento) {
    evento.preventDefault()
    const erroresEncontrados = validarRegistro({ ...valores, rol })
    setErrores(erroresEncontrados)
    if (Object.keys(erroresEncontrados).length > 0) return

    // confirmarContrasena solo se usa en el formulario, no va al backend
    onRegistrar({
      nombre: valores.nombre,
      correo: valores.correo,
      contrasena: valores.contrasena,
      rol,
      ...(rol === 'EMPRESA' ? { empresa: { id: valores.empresaId } } : {}),
    })
  }

  return (
    <form className="login-form" style={{ gap: 18 }} onSubmit={enviar} noValidate>
      <Input
        etiqueta="Nombre completo"
        nombre="nombre"
        value={valores.nombre}
        onChange={cambiar}
        error={errores.nombre}
      />
      <Input
        etiqueta="Correo electrónico"
        nombre="correo"
        type="email"
        placeholder="nombre@empresa.com"
        value={valores.correo}
        onChange={cambiar}
        error={errores.correo}
      />
      {rol === 'EMPRESA' && (
        <Select
          etiqueta="Empresa"
          nombre="empresaId"
          opciones={empresas.map((e) => ({ valor: e.id, texto: e.nombre }))}
          value={valores.empresaId}
          onChange={cambiar}
          error={errores.empresaId}
        />
      )}
      <Input
        etiqueta="Contraseña"
        nombre="contrasena"
        type="password"
        placeholder="Mínimo 6 caracteres"
        value={valores.contrasena}
        onChange={cambiar}
        error={errores.contrasena}
      />
      <Input
        etiqueta="Confirmar contraseña"
        nombre="confirmarContrasena"
        type="password"
        value={valores.confirmarContrasena}
        onChange={cambiar}
        error={errores.confirmarContrasena}
      />
      <Button type="submit" className="btn-grande">
        Crear cuenta
      </Button>
    </form>
  )
}

export default RegistroForm
