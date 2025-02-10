const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const { uploadFotoPermiso } = require("./config/multerConfig"); // Importamos la configuración de multer

dotenv.config(); // Cargar variables de entorno

const app = express();
const PORT = process.env.PORT || 5000;

// 📌 Middleware
app.use(cors());  // Habilita CORS para solicitudes desde diferentes orígenes
console.log("🚀 CORS habilitado");

app.use(express.json());  // Permite recibir datos en formato JSON
console.log("🚀 Middleware para JSON habilitado");

app.use(express.urlencoded({ extended: true }));  // Permite recibir datos en formato URL-encoded
console.log("🚀 Middleware para URL-encoded habilitado");

// 📌 Hacer públicas las carpetas donde se guardan imágenes de permisos
app.use("/media/permisos", express.static(path.join(__dirname, "media/permisos")));
console.log("🚀 Carpeta de imágenes de permisos accesible en /media/permisos");

// 📌 Conexión a MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB conectado correctamente"))
  .catch((err) => {
    console.error("❌ Error al conectar MongoDB:", err);
    process.exit(1);  // Termina el proceso si no puede conectar a MongoDB
  });

// 📌 Rutas
app.use("/api/proyectos", require("./routes/ProyectosRoutes"));
console.log("🚀 Ruta para proyectos: /api/proyectos");

app.use("/api/presupuestos", require("./routes/PresupuestoRoutes"));
console.log("🚀 Ruta para presupuestos: /api/presupuestos");

app.use("/api/permisos", require("./routes/PermisoRoutes"));
console.log("🚀 Ruta para permisos: /api/permisos");

app.use("/api/ubicaciones", require("./routes/UbicacionRoutes")); // Nueva ruta para ubicación
console.log("🚀 Ruta para ubicaciones: /api/ubicaciones");

// 📌 Ruta principal
app.get("/api/", (req, res) => {
  console.log("🚀 Ruta principal accedida");
  res.send({
    message: "Bienvenido a la API de Gestión de Proyectos",
    rutasDisponibles: {
      proyectos: "/api/proyectos",
      presupuestos: "/api/presupuestos",
      permisos: "/api/permisos",
      ubicaciones: "/api/ubicaciones", // Ruta de ubicación añadida
    },
  });
});

// 📌 Iniciar Servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});
