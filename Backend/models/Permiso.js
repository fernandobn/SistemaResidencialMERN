const mongoose = require("mongoose");

const PermisoSchema = new mongoose.Schema({
  id_proyecto: { type: mongoose.Schema.Types.ObjectId, ref: "Proyecto", required: true },
  tipo: { type: String, required: true },
  numero_permiso: { type: String, required: true },
  fecha_emision: { type: Date, required: true },
  fecha_vencimiento: { type: Date, default: null },
  foto: { type: String, required: false }, // Nombre del archivo de la foto (solo nombre, no ruta completa)
});

module.exports = mongoose.model("Permiso", PermisoSchema);
