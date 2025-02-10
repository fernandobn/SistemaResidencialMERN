const mongoose = require("mongoose");

const UbicacionSchema = new mongoose.Schema({
  id_ubicacion: { type: Number, required: false, unique: true }, // Generado automáticamente
  direccion: { type: String, required: true },
  ciudad: { type: String, required: true },
  estado: { type: String, required: true },
  codigo_postal: { type: String, required: true },
  pais: { type: String, required: true },
});

// 📌 Generar un `id_ubicacion` único antes de guardar
UbicacionSchema.pre("save", async function (next) {
  if (!this.id_ubicacion) {
    const lastUbicacion = await this.constructor.findOne().sort({ id_ubicacion: -1 });
    this.id_ubicacion = lastUbicacion ? lastUbicacion.id_ubicacion + 1 : 1;
  }
  next();
});

module.exports = mongoose.model("Ubicacion", UbicacionSchema);
