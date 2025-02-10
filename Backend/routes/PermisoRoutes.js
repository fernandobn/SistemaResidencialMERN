const express = require('express');
const router = express.Router();
const permisoController = require('../controllers/PermisoController');
const multer = require('multer');
const path = require('path');

// Configuración de Multer para manejar archivos (por ejemplo, fotos)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../media/permisos")); // Carpeta donde se guardarán las fotos
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Usamos el timestamp como nombre único
  }
});

const upload = multer({ storage });

// 📌 Ruta para crear un permiso
router.post('/', upload.single('foto'), permisoController.crearPermiso);

// 📌 Ruta para obtener todos los permisos
router.get('/', permisoController.obtenerPermisos);

// 📌 Ruta para obtener un permiso por ID
router.get('/:id', permisoController.obtenerPermisoPorId);

// 📌 Ruta para editar un permiso por ID (con manejo de foto)
router.put('/:id', upload.single('foto'), permisoController.editarPermiso);

// 📌 Ruta para eliminar un permiso por ID
router.delete('/:id', permisoController.eliminarPermiso);

module.exports = router;
