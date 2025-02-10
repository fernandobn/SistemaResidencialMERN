const express = require("express");
const router = express.Router();
const {
  obtenerUbicaciones,
  obtenerUbicacionPorId,
  crearUbicacion,
  actualizarUbicacion,
  eliminarUbicacion
} = require("../controllers/UbicacionController");

// 📌 Obtener todas las ubicaciones
router.get("/", obtenerUbicaciones);

// 📌 Obtener una ubicación por ID
router.get("/:id", obtenerUbicacionPorId);

// 📌 Crear una nueva ubicación
router.post("/", crearUbicacion);

// 📌 Actualizar una ubicación
router.put("/:id", actualizarUbicacion);

// 📌 Eliminar una ubicación
router.delete("/:id", eliminarUbicacion);

module.exports = router;
