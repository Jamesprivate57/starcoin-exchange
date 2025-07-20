import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/wallets': 'http://localhost:5000',
      '/transfer': 'http://localhost:5000',
      '/transactions': 'http://localhost:5000'
    }
  }
});
