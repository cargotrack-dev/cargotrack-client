import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@features': path.resolve(__dirname, './src/features'),
      '@Core': path.resolve(__dirname, './src/features/Core'),
      '@UI': path.resolve(__dirname, './src/features/UI'),
      '@shared': path.resolve(__dirname, './shared'),
    },
  },
})