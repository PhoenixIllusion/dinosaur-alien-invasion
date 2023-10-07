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
          "three": "https://unpkg.com/three@0.157.0/build/three.module.min.js"
        }
      }
    }
  },
  server: {
    host: 'localhost',
    port: 8080
  }
})