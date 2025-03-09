import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "./", // Указываем относительный путь для корректной работы
  build: {
    outDir: "dist" // Vercel ожидает, что билды находятся в dist
  }
})
