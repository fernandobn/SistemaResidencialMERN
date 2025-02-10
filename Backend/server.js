const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config(); // Cargar variables de entorno

const app = express();
const PORT = process.env.PORT || 5000;

// 📌 Middleware CORS
app.use(cors({
  origin: "http://localhost:5173", // Permitir solicitudes desde el frontend
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

console.log("🚀 CORS habilitado");

// 📌 Middleware para parsear JSON y URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

console.log("🚀 Middleware para JSON y URL-encoded habilitado");

// 📌 Servir archivos estáticos (Imágenes de permisos)
app.use("/media/permisos", express.static(path.join(__dirname, "media/permisos")));
console.log("🚀 Carpeta de imágenes de permisos accesible en /media/permisos");

// 📌 Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB conectado correctamente"))
  .catch((err) => {
    console.error("❌ Error al conectar MongoDB:", err);
    process.exit(1);  // Terminar el proceso si falla la conexión
  });

// 📌 Rutas de la API
app.use("/api/proyectos", require("./routes/ProyectosRoutes"));
app.use("/api/presupuestos", require("./routes/PresupuestoRoutes"));
app.use("/api/permisos", require("./routes/PermisoRoutes"));
app.use("/api/ubicaciones", require("./routes/UbicacionRoutes"));

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

// 📌 Iniciar Servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
