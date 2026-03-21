import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://tripsplit-server.onrender.com/api'
  : 'https://tripsplit-server.onrender.com/api'

export default defineConfig({
  define: {
    VITE_API_URL: JSON.stringify(API_URL),
  },
  plugins: [
    react(),
    {
      name: 'performance-optimizations',
      transformIndexHtml(html: string) {
        return html
          .replace(
            /<link rel="stylesheet" crossorigin href="(\/assets\/index-[^"]+\.css)">/,
            `<link rel="stylesheet" crossorigin href="$1" media="print" onload="this.media='all'" />`
          )
          .replace(
            '<div id="root"></div>',
            `<div id="root" style="min-height:100vh;display:flex;align-items:center;justify-content:center">
      <div style="width:40px;height:40px;border:3px solid #e5e7eb;border-top-color:#4f46e5;border-radius:50%;animation:spin .8s linear infinite"></div>
    </div>
    <style>@keyframes spin{to{transform:rotate(360deg)}}</style>`
          );
      },
    },
  ],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
  },
  build: {
    cssCodeSplit: true,
  },
})
