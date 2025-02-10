const Ubicacion = require("../models/Ubicacion");

// Obtener todas las ubicaciones
exports.obtenerUbicaciones = async (req, res) => {
  try {
    const ubicaciones = await Ubicacion.find();
    res.status(200).json(ubicaciones);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las ubicaciones", error });
  }
};

// Obtener una ubicación por ID
exports.obtenerUbicacionPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const ubicacion = await Ubicacion.findOne({ id_ubicacion: Number(id) });

    if (!ubicacion) {
      return res.status(404).json({ message: "Ubicación no encontrada" });
    }

    res.status(200).json(ubicacion);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la ubicación", error });
  }
};

// Crear una nueva ubicación
exports.crearUbicacion = async (req, res) => {
  try {
    const { direccion, ciudad, estado, codigo_postal, pais } = req.body;

    if (!direccion || !ciudad || !estado || !codigo_postal || !pais) {
      return res.status(400).json({ message: "Todos los campos son obligatorios." });
    }

    const nuevaUbicacion = new Ubicacion({ direccion, ciudad, estado, codigo_postal, pais });
    await nuevaUbicacion.save();

    res.status(201).json(nuevaUbicacion);
  } catch (error) {
    res.status(500).json({ message: "Error al crear la ubicación", error });
  }
};

// Actualizar una ubicación
exports.actualizarUbicacion = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { direccion, ciudad, estado, codigo_postal, pais } = req.body;

    const ubicacionActualizada = await Ubicacion.findOneAndUpdate(
      { id_ubicacion: id },
      { direccion, ciudad, estado, codigo_postal, pais },
      { new: true }
    );

    if (!ubicacionActualizada) {
      return res.status(404).json({ message: "Ubicación no encontrada" });
    }

    res.status(200).json(ubicacionActualizada);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar la ubicación", error });
  }
};

// Eliminar una ubicación
exports.eliminarUbicacion = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const ubicacionEliminada = await Ubicacion.findOneAndDelete({ id_ubicacion: id });

    if (!ubicacionEliminada) {
      return res.status(404).json({ message: "Ubicación no encontrada" });
    }

    res.status(200).json({ message: "Ubicación eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la ubicación", error });
  }
};
