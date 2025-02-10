const express = require("express");
const router = express.Router();
const {
  obtenerPresupuestos,
  obtenerPresupuestoPorId,
  crearPresupuesto,
  actualizarPresupuesto,
  eliminarPresupuesto,
} = require("../controllers/PresupuestoController");

// 📌 Obtener todos los presupuestos
router.get("/", obtenerPresupuestos);

// 📌 Obtener un presupuesto por ID
router.get("/:id", obtenerPresupuestoPorId);

// 📌 Crear un nuevo presupuesto
router.post("/", crearPresupuesto);

// 📌 Actualizar un presupuesto por ID
router.put("/:id", actualizarPresupuesto);

// 📌 Eliminar un presupuesto por ID
router.delete("/:id", eliminarPresupuesto);

module.exports = router;
