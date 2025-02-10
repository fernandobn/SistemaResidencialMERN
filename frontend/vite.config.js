import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // ✅ Permite que Render acceda a la aplicación
    port: process.env.PORT || 4173,  // ✅ Usa el puerto asignado por Render o el predeterminado (4173)
  },
  preview: {
    allowedHosts: ["sistemaresidencialfrontend.onrender.com"], // ✅ Permite la vista previa en Render
  }
})
