import { Navigate, Route, Routes, useLocation, useNavigate, useParams, useSearchParams } from 'react-router'
import AdminLayout from './modules/core/components/AdminLayout'
import { rutaDe, paginaDe } from './modules/core/lib/rutas'
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
import ReportesPage from './modules/reportes/components/ReportesPage'
import PortalLayout from './modules/portal/components/PortalLayout'
import PortalPage from './modules/portal/components/PortalPage'

// El estudiante solo usa el portal y el detalle de los retos
const PAGINAS_ESTUDIANTE = ['portal', 'retoDetalle']

// Estas funciones leen los datos de la URL y se los pasan a la página como props, igual que antes

// /retos?busqueda=...&empresaId=...
function RetosRuta({ usuario, navegar }) {
  const [parametros] = useSearchParams()
  const filtros = { busqueda: parametros.get('busqueda') || '', empresaId: parametros.get('empresaId') || '' }
  return <RetosPage usuario={usuario} navegar={navegar} filtrosIniciales={filtros} />
}

// /retos/:id
function RetoDetalleRuta({ usuario, navegar }) {
  const { id } = useParams()
  return <RetoDetallePage id={id} usuario={usuario} navegar={navegar} />
}

// /retos/nuevo?empresaId=...  y  /retos/:id/editar
function RetoFormRuta({ usuario, navegar }) {
  const { id } = useParams()
  const [parametros] = useSearchParams()
  return <RetoFormPage id={id} empresaId={parametros.get('empresaId') || undefined} usuario={usuario} navegar={navegar} />
}

function App() {
  const { usuario, error, setError, ingresar, registrarse, salir } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Los componentes siguen usando navegar(pagina, datos); ahora eso cambia la URL
  function navegar(pagina, datos = {}) {
    navigate(rutaDe(pagina, datos))
    window.scrollTo(0, 0)
  }

  function cerrarSesion() {
    salir()
    navigate('/inicio')
  }

  if (!usuario) {
    return <LoginPage error={error} setError={setError} onIngresar={ingresar} onRegistrar={registrarse} />
  }

  const esEstudiante = usuario.rol === 'ESTUDIANTE'
  const pagina = paginaDe(location.pathname)
  if (esEstudiante && !PAGINAS_ESTUDIANTE.includes(pagina)) {
    return <Navigate to="/portal" replace />
  }

  // La "key" hace que cada página se cargue de nuevo al cambiar la URL
  const clave = location.pathname + location.search

  // Portal (y detalle para estudiantes): barra superior blanca
  if (pagina === 'portal' || (esEstudiante && pagina === 'retoDetalle')) {
    return (
      <PortalLayout usuario={usuario} navegar={navegar} onSalir={cerrarSesion}>
        <Routes key={clave}>
          <Route path="/portal" element={<PortalPage usuario={usuario} navegar={navegar} />} />
          <Route
            path="/retos/:id"
            element={
              <div className="portal-main" style={{ gap: 20 }}>
                <RetoDetalleRuta usuario={usuario} navegar={navegar} />
              </div>
            }
          />
        </Routes>
      </PortalLayout>
    )
  }

  return (
    <AdminLayout
      paginaActual={pagina}
      navegar={navegar}
      nombreUsuario={usuario.nombre}
      detalleUsuario={textoRol(usuario.rol)}
      rol={usuario.rol}
      onSalir={cerrarSesion}
    >
      <Routes key={clave}>
        <Route path="/" element={<Navigate to="/inicio" replace />} />
        <Route path="/inicio" element={<InicioPage usuario={usuario} navegar={navegar} />} />
        <Route path="/retos" element={<RetosRuta usuario={usuario} navegar={navegar} />} />
        <Route path="/retos/nuevo" element={<RetoFormRuta usuario={usuario} navegar={navegar} />} />
        <Route path="/retos/:id" element={<RetoDetalleRuta usuario={usuario} navegar={navegar} />} />
        <Route path="/retos/:id/editar" element={<RetoFormRuta usuario={usuario} navegar={navegar} />} />
        <Route path="/empresas" element={<EmpresasPage navegar={navegar} />} />
        <Route path="/usuarios" element={<UsuariosPage />} />
        <Route path="/categorias" element={<CategoriasPage />} />
        <Route
          path="/reportes"
          element={usuario.rol === 'CESDE' ? <ReportesPage /> : <Navigate to="/inicio" replace />}
        />
        {/* Cualquier dirección que no exista lleva al inicio */}
        <Route path="*" element={<Navigate to="/inicio" replace />} />
      </Routes>
    </AdminLayout>
  )
}

export default App
