import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/create-payment-intent': 'http://localhost:3000',
      '/send-confirmation': 'http://localhost:3000',
      '/admin-orders': 'http://localhost:3000',
      '/verify-password': 'http://localhost:3000',
      '/orders': 'http://localhost:3000',
      '/api-status': 'http://localhost:3000',
    }
  }
})
