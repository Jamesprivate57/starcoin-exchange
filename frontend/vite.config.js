import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/wallets': 'http://localhost:10000',
      '/transactions': 'http://localhost:10000',
      '/trade': 'http://localhost:10000'
    }
  }
})
