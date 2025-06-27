import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const API = env.VITE_API_URL || 'http://localhost:5000'

  return {
    plugins: [react()],
    define: {
      'import.meta.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL ?? '')
    },
    server: {
      proxy: {
        '/api': {
          target: API,       // dev → проксируем на локал или на PROD, как залито в .env
          changeOrigin: true,
          secure: false,
          rewrite: path => path.replace(/^\/api/, '/api')
        }
      }
    },
    preview: { port: 3000, open: true }
  }
})