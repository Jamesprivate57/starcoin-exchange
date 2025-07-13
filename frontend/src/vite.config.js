// ~/starcoin-exchange/frontend/vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/wallets': 'http://localhost:5000',
      '/sell': 'http://localhost:5000',
      '/withdraw': 'http://localhost:5000',
      '/transactions': 'http://localhost:5000'
    }
  }
});
