import { useState } from 'react'
import Avatar from '../../core/design-system/Avatar'
import Segmento from '../../core/design-system/Segmento'
import IconButton from '../../core/design-system/IconButton'
import Mensaje from '../../core/components/Mensaje'
import { ROLES, textoRol } from '../../auth/utils/roles'
import { useUsuarios } from '../hooks/useUsuarios'
import UsuarioForm from './UsuarioForm'

// Colores del avatar según el rol, como en la maqueta
const COLORES_ROL = {
  CESDE: { background: '#15151B', color: '#fff' },
  EMPRESA: { background: '#EFE3F7', color: '#652D90' },
  ESTUDIANTE: { background: '#FCE4EE', color: '#A3195A' },
}

function UsuariosPage() {
  const { usuarios, registros, mensaje, crear, eliminar } = useUsuarios()
  const [rol, setRol] = useState('Todos')

  const pestanas = [
    { valor: 'Todos', texto: 'Todos', cantidad: usuarios.length },
    ...ROLES.map((r) => ({ valor: r.valor, texto: r.texto, cantidad: usuarios.filter((u) => u.rol === r.valor).length })),
  ]
  const visibles = rol === 'Todos' ? usuarios : usuarios.filter((u) => u.rol === rol)

  function postulaciones(usuario) {
    return registros.filter((r) => r.usuario?.id === usuario.id).length
  }

  function confirmarEliminar(usuario) {
    if (!window.confirm(`¿Eliminar a ${usuario.nombre}?`)) return
    eliminar(usuario)
  }

  return (
    <>
      <div className="titulo">
        <h1>Usuarios</h1>
        <p className="muted">CESDE, empresas y estudiantes con acceso a la plataforma.</p>
      </div>

      <UsuarioForm onCrear={crear} />

      <Mensaje texto={mensaje.texto} tipo={mensaje.tipo} />

      <Segmento opciones={pestanas} valor={rol} onCambiar={setRol} etiqueta="Rol" />

      <section className="card">
        <div className="tblbox">
          <table className="tbl" style={{ minWidth: 640 }}>
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Rol</th>
                <th>Postulaciones</th>
                <th>
                  <span className="sr">Acciones</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {visibles.map((usuario) => (
                <tr key={usuario.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <Avatar nombre={usuario.nombre} style={COLORES_ROL[usuario.rol]} />
                      <div>
                        <b>{usuario.nombre}</b>
                        <p className="muted" style={{ fontSize: 12 }}>
                          {usuario.correo}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="chip" style={{ background: '#F1F4F2', color: '#33373D', border: '1px solid #E6EAE8' }}>
                      {textoRol(usuario.rol)}
                    </span>
                  </td>
                  <td>{usuario.rol === 'ESTUDIANTE' ? postulaciones(usuario) : '—'}</td>
                  <td style={{ textAlign: 'right' }}>
                    <IconButton
                      icono="borrar"
                      etiqueta="Eliminar usuario"
                      variante="no"
                      onClick={() => confirmarEliminar(usuario)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {visibles.length === 0 && <p className="vacio">No hay usuarios con ese rol.</p>}
        </div>
      </section>
    </>
  )
}

export default UsuariosPage
