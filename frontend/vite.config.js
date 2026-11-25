import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // CHANGED: added a dev proxy. The NestJS backend does not enable CORS, so
  // calls to "/api/..." are forwarded to it from the Vite server instead —
  // this way the backend code does not have to change.
  // 3001 = PORT in the backend .env
  server: {
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
})
