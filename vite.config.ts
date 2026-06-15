import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

const DEV_PORT = 5173
const DEV_HOST = '127.0.0.1'

/** GitHub Pages subpath: VITE_BASE_PATH=/<repo-name>/ ; Gitee root: VITE_BASE_PATH=/ */
const base = process.env.VITE_BASE_PATH ?? '/'

export default defineConfig({
  base,
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        twinLab: resolve(__dirname, 'twin-lab/index.html'),
      },
    },
  },
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
