const mongoose = require("mongoose");

const PresupuestoSchema = new mongoose.Schema({
  id_proyecto: { type: mongoose.Schema.Types.ObjectId, ref: "Proyecto", required: true },
  monto_total: { type: Number, required: true },
  monto_utilizado: { type: Number, default: 0 },
  fecha_aprobacion: { type: Date, required: true },
});

module.exports = mongoose.model("Presupuesto", PresupuestoSchema);
