import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  resolve: {
    alias: {
      // Корневые папки проекта
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@assets': path.resolve(__dirname, './src/assets'),

      // Redux и связанные с ним файлы
      '@redux': path.resolve(__dirname, './src/redux'),
      '@slices': path.resolve(__dirname, './src/redux/slices'),
      '@services': path.resolve(__dirname, './src/services'),


      // Утилиты и общие функции
      '@utils': path.resolve(__dirname, './src/utils'),
      '@api': path.resolve(__dirname, './src/utils/api'),
      '@constants': path.resolve(__dirname, './src/utils/constants'),
      '@validation': path.resolve(__dirname, './src/utils/validation'),

      // UI компоненты
      '@ui': path.resolve(__dirname, './src/components/ui'),
      '@common': path.resolve(__dirname, './src/components/common'),
      '@auth': path.resolve(__dirname, './src/components/auth'),
      '@layouts': path.resolve(__dirname, './src/components/layouts'),

      // Другие часто используемые папки
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@styles': path.resolve(__dirname, './src/styles'),
      '@contexts': path.resolve(__dirname, './src/contexts')
    }
  }
})