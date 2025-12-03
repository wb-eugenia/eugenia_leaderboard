import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  },
  build: {
    outDir: 'dist',
    commonjsOptions: {
      include: [/recharts/, /node_modules/]
    },
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunks - Simplifié pour éviter les problèmes d'ordre de chargement
          if (id.includes('node_modules')) {
            // Recharts séparé car c'est très volumineux
            if (id.includes('recharts')) {
              return 'chart-vendor';
            }
            // Tout le reste dans un seul vendor chunk (incluant React)
            // Cela évite les problèmes d'ordre de chargement
            return 'vendor';
          }
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
  optimizeDeps: {
    include: ['recharts', 'react', 'react-dom', 'react-router-dom']
  }
})

