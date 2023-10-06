import { defineConfig } from 'vite'

export default defineConfig({
  root: 'src',
  build: {
    emptyOutDir: true,
    outDir: '../../public',
    rollupOptions: {
      external: ['three'],
      output: {
        paths: {
          "three": "https://unpkg.com/three@<version>/build/three.module.js"
        }
      }
    }
  },
  server: {
    host: 'localhost',
    port: 8080
  }
})