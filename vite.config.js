import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// Sirve los PNG que genera el repo de Python (carpeta "reportes") sin copiarlos al frontend.
//   GET /api-reportes/lista        -> [{ archivo, actualizado }]
//   GET /api-reportes/img/<png>    -> la imagen
// Por defecto usa ../integrador_nt_sabados20262_3/reportes; se puede cambiar con REPORTES_DIR en .env.local
function reportesPlugin(carpeta) {
  return {
    name: 'reportes',
    configureServer(server) {
      server.middlewares.use('/api-reportes', (req, res) => {
        const url = decodeURIComponent(req.url.split('?')[0])

        if (url === '/lista') {
          const archivos = fs.existsSync(carpeta)
            ? fs
                .readdirSync(carpeta)
                .filter((nombre) => nombre.toLowerCase().endsWith('.png'))
                .sort()
                .map((archivo) => ({ archivo, actualizado: fs.statSync(path.join(carpeta, archivo)).mtimeMs }))
            : null
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(archivos ? { archivos } : { error: `No existe la carpeta ${carpeta}` }))
          return
        }

        // path.basename evita que pidan archivos fuera de la carpeta (../)
        const archivo = path.join(carpeta, path.basename(url.replace('/img/', '')))
        if (url.startsWith('/img/') && archivo.endsWith('.png') && fs.existsSync(archivo)) {
          res.setHeader('Content-Type', 'image/png')
          res.setHeader('Cache-Control', 'no-store')
          fs.createReadStream(archivo).pipe(res)
          return
        }

        res.statusCode = 404
        res.end()
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  // Por defecto: el repo de Python clonado al lado de este proyecto
  const carpetaReportes = path.resolve(env.REPORTES_DIR || '../integrador_nt_sabados20262_3/reportes')

  return {
    plugins: [react(), reportesPlugin(carpetaReportes)],
  }
})
