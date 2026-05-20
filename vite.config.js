import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/',
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-core':   ['react', 'react-dom', 'react-router-dom'],
          'maps':         ['leaflet', 'react-leaflet', 'mapbox-gl', 'react-map-gl'],
          'qr':           ['html5-qrcode', '@yudiel/react-qr-scanner'],
          'icons':        ['lucide-react', 'react-icons'],
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
