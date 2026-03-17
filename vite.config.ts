import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

   server: {
    port: 3000, // Optional: set custom port
    open: true, // Optional: auto-open browser
  },
})
