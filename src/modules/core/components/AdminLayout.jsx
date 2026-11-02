import { useState } from 'react'
import Icono from '../design-system/Icono'
import Button from '../design-system/Button'
import Avatar from '../design-system/Avatar'

const menuGeneral = [
  { id: 'inicio', texto: 'Inicio', icono: 'inicio' },
  { id: 'retos', texto: 'Retos', icono: 'retos' },
  { id: 'empresas', texto: 'Empresas', icono: 'empresas' },
  { id: 'usuarios', texto: 'Usuarios', icono: 'usuarios' },
  { id: 'categorias', texto: 'Categorías', icono: 'categorias' },
]

// Solo CESDE administra empresas, usuarios y categorías; una cuenta Empresa solo ve sus propios retos
const SOLO_CESDE = ['empresas', 'usuarios', 'categorias']

// Estructura de la vista de administración: menú lateral oscuro + barra superior
function AdminLayout({ paginaActual, navegar, nombreUsuario, detalleUsuario, rol, onSalir, children }) {
  const [busqueda, setBusqueda] = useState('')
  const menu = rol === 'EMPRESA' ? menuGeneral.filter((opcion) => !SOLO_CESDE.includes(opcion.id)) : menuGeneral

  // La búsqueda lleva a la lista de retos filtrada
  function buscar(evento) {
    evento.preventDefault()
    navegar('retos', { busqueda })
    setBusqueda('')
  }

  // El detalle y el formulario de retos marcan "Retos" en el menú
  const marcado = paginaActual.startsWith('reto') ? 'retos' : paginaActual

  return (
    <div className="app">
      <aside className="side">
        <div className="brand">
          <img src="/logo-cesde.svg" alt="CESDE" className="logo-cesde" />
          <div className="wm">
            <small>Retos empresariales</small>
          </div>
        </div>

        <div className="navlbl">General</div>
        <nav className="nav" aria-label="Principal">
          {menu.map((opcion) => (
            <button
              key={opcion.id}
              className={marcado === opcion.id ? 'on' : ''}
              onClick={() => navegar(opcion.id)}
            >
              <Icono nombre={opcion.icono} />
              {opcion.texto}
            </button>
          ))}
        </nav>

        <div className="navlbl">Vistas</div>
        <nav className="nav" aria-label="Vistas">
          <button onClick={() => navegar('portal')}>
            <Icono nombre="portal" />
            Portal estudiante
          </button>
          <button onClick={onSalir}>
            <Icono nombre="salir" />
            Cerrar sesión
          </button>
        </nav>

        <div className="help">
          <b>¿Primera vez aquí?</b>
          Publica un reto en menos de 3 minutos con el formulario guiado.
          <Button variante="a" onClick={() => navegar('retoForm')}>
            Crear mi primer reto
          </Button>
        </div>
      </aside>

      <div className="main">
        <header className="top">
          <form className="search" onSubmit={buscar}>
            <Icono nombre="buscar" />
            <label htmlFor="q" className="sr">
              Buscar
            </label>
            <input
              id="q"
              placeholder="Buscar retos, empresas o categorías"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </form>
          <div className="tools">
            <Button icono="mas" onClick={() => navegar('retoForm')}>
              Nuevo reto
            </Button>
            <div className="me">
              <Avatar nombre={nombreUsuario} />
              <div>
                <b>{nombreUsuario}</b>
                <span>{detalleUsuario}</span>
              </div>
            </div>
          </div>
        </header>
        <main className="wrap">{children}</main>
      </div>
    </div>
  )
}

export default AdminLayout
