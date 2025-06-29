import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, fileURLToPath(new URL('.', import.meta.url)), '')
  
  // Configure API URL based on environment
  const API_URL = mode === 'production' 
    ? env.VITE_API_URL || 'https://ibm-team-project-production.up.railway.app'
    : env.VITE_API_URL || 'https://ibm-team-project-production.up.railway.app'
  
  // Debug logging (only in development)
  if (mode === 'development') {
    console.log('Vite Config - Mode:', mode)
    console.log('Vite Config - API URL from env:', env.VITE_API_URL)
    console.log('Vite Config - Final API target:', API_URL)
  }

  return {
    plugins: [react()],
    define: {
      'import.meta.env.VITE_API_URL': JSON.stringify(API_URL),
      'import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY': JSON.stringify(env.VITE_STRIPE_PUBLISHABLE_KEY || '')
    },
    server: {
      proxy: {
        '/api': {
          target: API_URL,
          changeOrigin: true,
          secure: true,
          rewrite: path => path.replace(/^\/api/, '/api')
        }
      }
    },
    preview: { port: 3000, open: true },
    build: {
      outDir: 'dist',
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            stripe: ['@stripe/stripe-js', '@stripe/react-stripe-js']
          }
        }
      }
    }
  }
})