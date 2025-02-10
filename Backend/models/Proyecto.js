const mongoose = require("mongoose");

const ProyectoSchema = new mongoose.Schema({
  id_proyecto: { type: Number, required: false, unique: true },
  nombre: { type: String, required: true },
  descripcion: { type: String, required: true },
  fecha_inicio: { type: Date, required: true },
  fecha_fin: { type: Date, default: null },
  id_ubicacion: { type: mongoose.Schema.Types.ObjectId, ref: "Ubicacion", required: true },
});

// Generar un `id_proyecto` único antes de guardar
ProyectoSchema.pre("save", async function (next) {
  if (!this.id_proyecto) {
    const lastProyecto = await this.constructor.findOne().sort({ id_proyecto: -1 });
    this.id_proyecto = lastProyecto ? lastProyecto.id_proyecto + 1 : 1;
  }
  next();
});

module.exports = mongoose.model("Proyecto", ProyectoSchema);
