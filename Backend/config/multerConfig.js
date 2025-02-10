const multer = require("multer");
const path = require("path");

// Configuración de Multer para guardar imágenes en la carpeta 'media/permisos'
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../media/permisos")); // Ruta donde se almacenarán las fotos
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Nombre único para la foto
  },
});

const uploadFotoPermiso = multer({ storage: storage }).single("foto");

module.exports = { uploadFotoPermiso };
