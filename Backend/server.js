const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config(); // Cargar variables de entorno

const app = express();
const PORT = process.env.PORT || 5000;

// 📌 Middleware CORS (Asegura que el frontend pueda hacer peticiones al backend)
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173", // Permitir solicitudes desde el frontend
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

console.log("🚀 CORS habilitado para:", process.env.FRONTEND_URL || "http://localhost:5173");

// 📌 Middleware para parsear JSON y URL-encoded (asegura compatibilidad con `multer`)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

console.log("🚀 Middleware para JSON y URL-encoded habilitado");

// 📌 Servir archivos estáticos (Imágenes de permisos)
const permisosPath = path.join(__dirname, "media/permisos");
app.use("/media/permisos", express.static(permisosPath));
console.log("🚀 Carpeta de imágenes de permisos accesible en /media/permisos");

// 📌 Conexión a MongoDB con manejo de errores (corregido)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB conectado correctamente"))
  .catch((err) => {
    console.error("❌ Error al conectar MongoDB:", err);
    process.exit(1); // Termina el proceso si no se puede conectar a la BD
  });

// 📌 Importar y usar rutas API
const proyectosRoutes = require("./routes/ProyectosRoutes");
const presupuestosRoutes = require("./routes/PresupuestoRoutes");
const permisosRoutes = require("./routes/PermisoRoutes");
const ubicacionesRoutes = require("./routes/UbicacionRoutes");

app.use("/api/proyectos", proyectosRoutes);
app.use("/api/presupuestos", presupuestosRoutes);
app.use("/api/permisos", permisosRoutes);
app.use("/api/ubicaciones", ubicacionesRoutes);

console.log("🚀 Rutas API configuradas correctamente");

// 📌 Ruta principal (Prueba si el servidor está activo)
app.get("/api/", (req, res) => {
  console.log("🚀 Ruta principal accedida");
  res.json({
    message: "Bienvenido a la API de Gestión de Proyectos",
    rutasDisponibles: {
      proyectos: "/api/proyectos",
      presupuestos: "/api/presupuestos",
      permisos: "/api/permisos",
      ubicaciones: "/api/ubicaciones",
    },
  });
});

// 📌 Iniciar Servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
