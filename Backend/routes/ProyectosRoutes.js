const express = require("express");
const router = express.Router();
const {
  obtenerProyectos,
  obtenerProyectoPorId,
  crearProyecto,
  editarProyecto,
  eliminarProyecto
} = require("../controllers/ProyectoController"); // 📌 Verifica la ruta

// 📌 Definición de rutas
router.get("/", obtenerProyectos);
router.get("/:id", obtenerProyectoPorId);
router.post("/", crearProyecto);
router.put("/:id", editarProyecto);
router.delete("/:id", eliminarProyecto);

module.exports = router;
