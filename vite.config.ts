import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // This tells Vite to listen on all network interfaces,
    // making it accessible from your local network.
    host: true, // or '0.0.0.0'
    // You can also specify the port if you want,
    // otherwise it will use the default (usually 5173)
    // port: 3000,
  },
});