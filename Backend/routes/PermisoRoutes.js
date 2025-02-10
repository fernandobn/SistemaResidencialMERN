const express = require("express");
const router = express.Router();
const permisoController = require("../controllers/PermisoController");

// 📌 Ruta para crear un permiso (ya no necesita `multer`)
router.post("/", permisoController.crearPermiso);

// 📌 Ruta para obtener todos los permisos
router.get("/", permisoController.obtenerPermisos);

// 📌 Ruta para obtener un permiso por ID
router.get("/:id", permisoController.obtenerPermisoPorId);

// 📌 Ruta para editar un permiso por ID (ahora sin `multer`)
router.put("/:id", express.json(), permisoController.editarPermiso);

// 📌 Ruta para eliminar un permiso por ID
router.delete("/:id", permisoController.eliminarPermiso);

module.exports = router;
