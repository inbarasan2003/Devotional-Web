import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],

   server: {
    port: 3000, // Optional: set custom port
    open: true, // Optional: auto-open browser
  },
})





