import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, fileURLToPath(new URL('.', import.meta.url)), '')
  
  // For development, use the hosted backend directly
  const API = mode === 'development' 
    ? 'https://ibm-team-project-production.up.railway.app'
    : env.VITE_API_URL || 'https://ibm-team-project-production.up.railway.app'
  
  // Debug logging
  console.log('Vite Config - Mode:', mode)
  console.log('Vite Config - API URL from env:', env.VITE_API_URL)
  console.log('Vite Config - Final API target:', API)

  return {
    plugins: [react()],
    define: {
      'import.meta.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL || 'https://ibm-team-project-production.up.railway.app')
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