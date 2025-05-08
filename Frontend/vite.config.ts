import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server:{
    host:'0.0.0.0',
    port:5172,
  },
  build:{
    // outDir:'/var/www/html/Message-V2',
    emptyOutDir:true
  },
  plugins: [react()],
})