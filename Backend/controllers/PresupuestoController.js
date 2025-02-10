const mongoose = require("mongoose");
const Presupuesto = require("../models/Presupuesto");

// 📌 Obtener todos los presupuestos
const obtenerPresupuestos = async (req, res) => {
  try {
    const presupuestos = await Presupuesto.find().populate("id_proyecto", "nombre").exec();
    console.log("✅ Lista de presupuestos obtenida correctamente.");
    res.status(200).json(presupuestos);
  } catch (error) {
    console.error("🚨 Error al obtener los presupuestos:", error);
    res.status(500).json({ message: "❌ Error al obtener los presupuestos", error });
  }
};

// 📌 Obtener un presupuesto por ID
const obtenerPresupuestoPorId = async (req, res) => {
  const { id } = req.params;

  console.log("🔎 Buscando presupuesto con ID:", id);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    console.error("❌ ID inválido:", id);
    return res.status(400).json({ error: "El ID del presupuesto no es válido." });
  }

  try {
    const presupuesto = await Presupuesto.findById(id).populate("id_proyecto", "nombre");

    if (!presupuesto) {
      console.warn("⚠️ Presupuesto no encontrado:", id);
      return res.status(404).json({ error: "Presupuesto no encontrado." });
    }

    console.log("✅ Presupuesto encontrado:", presupuesto);
    res.status(200).json(presupuesto);
  } catch (error) {
    console.error("🚨 Error al obtener presupuesto:", error);
    res.status(500).json({ error: "Error interno al obtener presupuesto." });
  }
};

// 📌 Crear un nuevo presupuesto
const crearPresupuesto = async (req, res) => {
  const { id_proyecto, monto_total, monto_utilizado, fecha_aprobacion } = req.body;

  console.log("📌 Creando nuevo presupuesto...");
  console.log("📋 Datos recibidos:", req.body);

  if (!mongoose.Types.ObjectId.isValid(id_proyecto)) {
    console.error("❌ ID de proyecto inválido:", id_proyecto);
    return res.status(400).json({ message: "El campo id_proyecto debe ser un ID válido." });
  }

  try {
    const nuevoPresupuesto = new Presupuesto({
      id_proyecto,
      monto_total,
      monto_utilizado,
      fecha_aprobacion,
    });

    await nuevoPresupuesto.save();
    console.log("✅ Presupuesto creado exitosamente:", nuevoPresupuesto);
    res.status(201).json(nuevoPresupuesto);
  } catch (error) {
    console.error("🚨 Error al crear presupuesto:", error);
    res.status(500).json({ message: "Error al crear presupuesto" });
  }
};

// 📌 Actualizar un presupuesto
const actualizarPresupuesto = async (req, res) => {
  const { id } = req.params;
  const { monto_total, monto_utilizado, fecha_aprobacion, id_proyecto } = req.body;

  console.log("🛠️ Actualizando presupuesto con ID:", id);
  console.log("📋 Datos recibidos:", req.body);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    console.error("❌ ID de presupuesto inválido:", id);
    return res.status(400).json({ error: "El ID del presupuesto no es válido." });
  }

  try {
    const presupuesto = await Presupuesto.findById(id);
    if (!presupuesto) {
      console.warn("⚠️ Presupuesto no encontrado:", id);
      return res.status(404).json({ error: "Presupuesto no encontrado." });
    }

    // Actualizar solo los campos proporcionados
    if (monto_total !== undefined) presupuesto.monto_total = monto_total;
    if (monto_utilizado !== undefined) presupuesto.monto_utilizado = monto_utilizado;
    if (fecha_aprobacion !== undefined) presupuesto.fecha_aprobacion = fecha_aprobacion;
    if (id_proyecto !== undefined) {
      if (!mongoose.Types.ObjectId.isValid(id_proyecto)) {
        console.error("❌ ID de proyecto inválido:", id_proyecto);
        return res.status(400).json({ error: "El ID del proyecto no es válido." });
      }
      presupuesto.id_proyecto = id_proyecto;
    }

    await presupuesto.save();
    console.log("✅ Presupuesto actualizado correctamente:", presupuesto);
    res.status(200).json(presupuesto);
  } catch (error) {
    console.error("🚨 Error al actualizar presupuesto:", error);
    res.status(500).json({ error: "Error interno al actualizar presupuesto." });
  }
};

// 📌 Eliminar un presupuesto
const eliminarPresupuesto = async (req, res) => {
  const { id } = req.params;

  console.log("🗑️ Eliminando presupuesto con ID:", id);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    console.error("❌ ID inválido:", id);
    return res.status(400).json({ error: "El ID del presupuesto no es válido." });
  }

  try {
    const presupuestoEliminado = await Presupuesto.findByIdAndDelete(id);
    if (!presupuestoEliminado) {
      console.warn("⚠️ Presupuesto no encontrado para eliminar:", id);
      return res.status(404).json({ error: "Presupuesto no encontrado." });
    }

    console.log("✅ Presupuesto eliminado correctamente:", presupuestoEliminado);
    res.status(200).json({ message: "Presupuesto eliminado exitosamente." });
  } catch (error) {
    console.error("🚨 Error al eliminar presupuesto:", error);
    res.status(500).json({ error: "Error interno al eliminar presupuesto." });
  }
};

module.exports = {
  obtenerPresupuestos,
  obtenerPresupuestoPorId,
  crearPresupuesto,
  actualizarPresupuesto,
  eliminarPresupuesto,
};
