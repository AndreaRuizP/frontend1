import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/',
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('react-dom') || id.includes('react-router-dom')) return 'react-core';
          if (id.includes('leaflet') || id.includes('mapbox-gl') || id.includes('react-map-gl')) return 'maps';
          if (id.includes('html5-qrcode') || id.includes('react-qr-scanner')) return 'qr';
          if (id.includes('lucide-react') || id.includes('react-icons')) return 'icons';
        },
      },
    },
  },
  server: {
    headers: {
      'Content-Security-Policy': "default-src 'self' https:; script-src 'self' 'unsafe-inline' https:; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: https:; font-src 'self' https:; connect-src 'self' https:;",
    },
  },
})
