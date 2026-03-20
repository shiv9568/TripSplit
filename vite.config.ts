import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://tripsplit-server.onrender.com/api'
  : 'https://tripsplit-server.onrender.com/api'

export default defineConfig({
  define: {
    VITE_API_URL: JSON.stringify(API_URL),
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'TripSplit - Professional Expense Manager',
        short_name: 'TripSplit',
        description: 'Track and split travel expenses with your crew',
        theme_color: '#4f46e5',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
  },
})
