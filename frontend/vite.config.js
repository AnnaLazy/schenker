import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/', // Если деплоить в поддиректорию – поменяй на '/subdir/'
  build: {
    outDir: 'dist'
  },
  server: {
    proxy: {
      '/api': { // Исправлено на `/api` для лучшей масштабируемости
        target: import.meta.env.VITE_API_URL || 'https://schenker-production.up.railway.app',
        changeOrigin: true,
        secure: true
      }
    }
  }
});