import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const DEV_PORT = 5173
const DEV_HOST = '127.0.0.1'

export default defineConfig({
  plugins: [react()],
  server: {
    host: DEV_HOST,
    port: DEV_PORT,
    strictPort: true,
    open: false,
  },
  preview: {
    host: DEV_HOST,
    port: DEV_PORT,
    strictPort: true,
  },
})
