import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(),
react()],
 resolve: {
    alias: {
      buffer: 'buffer',
      process: 'process/browser',
      stream: 'stream-browserify',
      util: 'util',
      path: 'path-browserify',
    },
  },
  define: {
    global: 'globalThis',
  },
  optimizeDeps: {
    include: [
      'buffer',
      'process',
      'stream-browserify',
      'util',
      'path-browserify',
    ],
    exclude: ['argon2', 'argon2id'], // Exclude Node.js-only packages
  },
  server: {
    proxy: {
      '/user': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})
