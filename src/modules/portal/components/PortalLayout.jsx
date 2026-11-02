import Avatar from '../../core/design-system/Avatar'

// Barra superior blanca del portal del estudiante
function PortalLayout({ usuario, navegar, onSalir, children }) {
  const esEstudiante = usuario.rol === 'ESTUDIANTE'

  // "Mis postulaciones" está en la misma página del portal
  function irAPostulaciones() {
    navegar('portal')
    setTimeout(() => document.getElementById('postulaciones')?.scrollIntoView({ behavior: 'smooth' }), 50)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F1F4F2' }}>
      <header className="portal-top">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src="/logo-cesde.svg" alt="CESDE" className="logo-cesde" />
          <span className="muted" style={{ fontSize: 13, fontWeight: 600 }}>
            Estudiantes
          </span>
        </div>
        <nav className="tnav" aria-label="Portal">
          <button className="on" onClick={() => navegar('portal')}>
            Explorar retos
          </button>
          {esEstudiante && <button onClick={irAPostulaciones}>Mis postulaciones</button>}
        </nav>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 16 }}>
          {!esEstudiante && (
            <a style={{ fontSize: 13, fontWeight: 700 }} onClick={() => navegar('inicio')}>
              Vista administración
            </a>
          )}
          <a style={{ fontSize: 13, fontWeight: 700 }} onClick={onSalir}>
            Cerrar sesión
          </a>
          <Avatar nombre={usuario.nombre} />
        </div>
      </header>
      {children}
    </div>
  )
}

export default PortalLayout
