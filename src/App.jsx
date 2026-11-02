import { useState } from 'react'
import AdminLayout from './modules/core/components/AdminLayout'
import LoginPage from './modules/auth/components/LoginPage'
import { useAuth } from './modules/auth/hooks/useAuth'
import { textoRol } from './modules/auth/utils/roles'
import InicioPage from './modules/inicio/components/InicioPage'
import RetosPage from './modules/retos/components/RetosPage'
import RetoDetallePage from './modules/retos/components/RetoDetallePage'
import RetoFormPage from './modules/retos/components/RetoFormPage'
import EmpresasPage from './modules/empresas/components/EmpresasPage'
import UsuariosPage from './modules/usuarios/components/UsuariosPage'
import CategoriasPage from './modules/categorias/components/CategoriasPage'
import PortalLayout from './modules/portal/components/PortalLayout'
import PortalPage from './modules/portal/components/PortalPage'

// El estudiante solo usa el portal y el detalle de los retos
const PAGINAS_ESTUDIANTE = ['portal', 'retoDetalle']

function App() {
  const { usuario, error, setError, ingresar, registrarse, salir } = useAuth()
  // Página actual y sus datos (por ejemplo el id del reto)
  const [vista, setVista] = useState({ pagina: 'inicio', datos: {} })

  function navegar(pagina, datos = {}) {
    setVista({ pagina, datos })
    window.scrollTo(0, 0)
  }

  function cerrarSesion() {
    salir()
    setVista({ pagina: 'inicio', datos: {} })
  }

  if (!usuario) {
    return <LoginPage error={error} setError={setError} onIngresar={ingresar} onRegistrar={registrarse} />
  }

  const esEstudiante = usuario.rol === 'ESTUDIANTE'
  const pagina = esEstudiante && !PAGINAS_ESTUDIANTE.includes(vista.pagina) ? 'portal' : vista.pagina
  const { datos } = vista

  // Portal (y detalle para estudiantes): barra superior blanca
  if (pagina === 'portal' || (esEstudiante && pagina === 'retoDetalle')) {
    return (
      <PortalLayout usuario={usuario} navegar={navegar} onSalir={cerrarSesion}>
        {pagina === 'portal' ? (
          <PortalPage usuario={usuario} navegar={navegar} />
        ) : (
          <div className="portal-main" style={{ gap: 20 }}>
            <RetoDetallePage key={datos.id} id={datos.id} usuario={usuario} navegar={navegar} />
          </div>
        )}
      </PortalLayout>
    )
  }

  // La "key" hace que cada página se cargue de nuevo al entrar
  const clave = pagina + JSON.stringify(datos)

  return (
    <AdminLayout
      paginaActual={pagina}
      navegar={navegar}
      nombreUsuario={usuario.nombre}
      detalleUsuario={textoRol(usuario.rol)}
      rol={usuario.rol}
      onSalir={cerrarSesion}
    >
      {pagina === 'inicio' && <InicioPage key={clave} usuario={usuario} navegar={navegar} />}
      {pagina === 'retos' && <RetosPage key={clave} navegar={navegar} filtrosIniciales={datos} usuario={usuario} />}
      {pagina === 'retoDetalle' && <RetoDetallePage key={clave} id={datos.id} usuario={usuario} navegar={navegar} />}
      {pagina === 'retoForm' && <RetoFormPage key={clave} id={datos.id} empresaId={datos.empresaId} usuario={usuario} navegar={navegar} />}
      {pagina === 'empresas' && <EmpresasPage key={clave} navegar={navegar} />}
      {pagina === 'usuarios' && <UsuariosPage key={clave} />}
      {pagina === 'categorias' && <CategoriasPage key={clave} />}
    </AdminLayout>
  )
}

export default App
