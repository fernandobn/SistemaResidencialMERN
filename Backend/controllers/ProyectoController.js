const mongoose = require("mongoose");
const Proyecto = require("../models/Proyecto");

// 📌 Obtener todos los proyectos
exports.obtenerProyectos = async (req, res) => {
  try {
    const proyectos = await Proyecto.find().populate("id_ubicacion", "direccion ciudad estado pais");
    res.status(200).json(proyectos);
  } catch (error) {
    console.error("🚨 Error al obtener los proyectos:", error);
    res.status(500).json({ message: "❌ Error al obtener los proyectos", error });
  }
};

// 📌 Obtener un proyecto por `id_proyecto`
exports.obtenerProyectoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const proyecto = await Proyecto.findOne({ id_proyecto: id });

    if (!proyecto) {
      return res.status(404).json({ message: "❌ Proyecto no encontrado." });
    }

    res.status(200).json(proyecto);
  } catch (error) {
    console.error("🚨 Error al obtener el proyecto:", error);
    res.status(500).json({ message: "❌ Error al obtener el proyecto", error });
  }
};

// 📌 Crear un nuevo proyecto
exports.crearProyecto = async (req, res) => {
  try {
    const { nombre, descripcion, fecha_inicio, fecha_fin, id_ubicacion } = req.body;

    // Verificar que se haya enviado el id_ubicacion correctamente
    if (!id_ubicacion || !mongoose.Types.ObjectId.isValid(id_ubicacion)) {
      return res.status(400).json({ message: "El campo id_ubicacion es requerido y debe ser un ID válido." });
    }

    // Crear un nuevo proyecto
    const nuevoProyecto = new Proyecto({
      nombre,
      descripcion,
      fecha_inicio,
      fecha_fin,
      id_ubicacion, // Solo se guarda el id de la ubicación
    });

    // Guardar el proyecto en la base de datos
    await nuevoProyecto.save();

    // Responder con el proyecto creado
    res.status(201).json({ proyecto: nuevoProyecto });
  } catch (error) {
    console.error("🚨 Error al crear el proyecto:", error);
    res.status(500).json({ message: "Hubo un error al crear el proyecto." });
  }
};

// 📌 Editar un proyecto
exports.editarProyecto = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, fecha_inicio, fecha_fin, id_ubicacion } = req.body;

    console.log("📩 Datos recibidos:", req.body);

    // Validación de id_ubicacion (ObjectId)
    if (!mongoose.Types.ObjectId.isValid(id_ubicacion)) {
      return res.status(400).json({ message: "❌ ID de ubicación inválido." });
    }

    const proyectoActualizado = await Proyecto.findOneAndUpdate(
      { id_proyecto: id },
      { nombre, descripcion, fecha_inicio, fecha_fin, id_ubicacion },
      { new: true }
    );

    if (!proyectoActualizado) {
      return res.status(404).json({ message: "❌ Proyecto no encontrado." });
    }

    res.status(200).json({ message: "✅ Proyecto actualizado con éxito", proyecto: proyectoActualizado });
  } catch (error) {
    console.error("🚨 Error al actualizar el proyecto:", error);
    res.status(500).json({ message: "❌ Error al actualizar el proyecto", error });
  }
};

// 📌 Eliminar un proyecto
exports.eliminarProyecto = async (req, res) => {
  try {
    const { id } = req.params;

    const proyectoEliminado = await Proyecto.findOneAndDelete({ id_proyecto: id });

    if (!proyectoEliminado) {
      return res.status(404).json({ message: "❌ Proyecto no encontrado." });
    }

    res.status(200).json({ message: "✅ Proyecto eliminado correctamente" });
  } catch (error) {
    console.error("🚨 Error al eliminar el proyecto:", error);
    res.status(500).json({ message: "❌ Error al eliminar el proyecto", error });
  }
};
