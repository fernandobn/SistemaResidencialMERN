const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// 📌 Middleware CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

console.log("🚀 CORS habilitado para:", process.env.FRONTEND_URL || "http://localhost:5173");

// 📌 Middleware para JSON y URL-encoded
app.use(express.json({ limit: "10mb" })); // ⬅️ Permitir imágenes en Base64 sin límite muy bajo
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

console.log("🚀 Middleware para JSON y URL-encoded habilitado");

// 📌 Servir imágenes
const permisosPath = path.join(__dirname, "media/permisos");
app.use("/media/permisos", express.static(permisosPath));
console.log("🚀 Carpeta de imágenes accesible en /media/permisos");

// 📌 Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB conectado correctamente"))
  .catch((err) => {
    console.error("❌ Error al conectar MongoDB:", err);
    process.exit(1);
  });
  app.use((req, res, next) => {
    console.log("📡 Nueva solicitud recibida:");
    console.log("🔹 Método:", req.method);
    console.log("🔹 URL:", req.url);
    console.log("🔹 Headers:", req.headers["content-type"]);
    console.log("🔹 Body recibido:", req.body);
    next();
  });
  
// 📌 Importar Rutas API
const proyectosRoutes = require("./routes/ProyectosRoutes");
const presupuestosRoutes = require("./routes/PresupuestoRoutes");
const permisosRoutes = require("./routes/PermisoRoutes");
const ubicacionesRoutes = require("./routes/UbicacionRoutes");

app.use("/api/proyectos", proyectosRoutes);
app.use("/api/presupuestos", presupuestosRoutes);
app.use("/api/permisos", permisosRoutes);
app.use("/api/ubicaciones", ubicacionesRoutes);

console.log("🚀 Rutas API configuradas correctamente");

// 📌 Ruta principal
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

// 📌 Manejo global de errores
app.use((err, req, res, next) => {
  console.error("❌ Error inesperado:", err);
  res.status(500).json({ success: false, message: "Error interno del servidor" });
});

// 📌 Iniciar Servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
