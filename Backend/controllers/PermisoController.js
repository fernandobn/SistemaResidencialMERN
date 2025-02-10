const Permiso = require("../models/Permiso"); // Asegúrate de que esta línea esté correcta dependiendo de la estructura de tu proyecto.

exports.crearPermiso = async (req, res) => {
  try {
    const { tipo, numero_permiso, fecha_emision, fecha_vencimiento, id_proyecto } = req.body;

    // Si hay un archivo subido, guardamos solo el nombre del archivo (no la ruta completa)
    const foto = req.file ? req.file.filename : null;

    const nuevoPermiso = new Permiso({
      tipo,
      numero_permiso,
      fecha_emision,
      fecha_vencimiento,
      id_proyecto,
      foto,  // Solo el nombre del archivo se guarda aquí
    });

    await nuevoPermiso.save();

    res.status(201).json({
      success: true,
      message: "Permiso creado exitosamente",
      data: nuevoPermiso,
    });
  } catch (error) {
    console.error("❌ Error al crear permiso:", error);
    res.status(500).json({
      success: false,
      message: "Error al crear permiso",
      error: error.message,
    });
  }
};



// Controlador para obtener todos los permisos
exports.obtenerPermisos = async (req, res) => {
  try {
    const permisos = await Permiso.find()
      .populate('id_proyecto', 'nombre')  // Asegúrate de que 'id_proyecto' sea una referencia válida
      .exec();

    res.json({
      success: true,
      data: permisos,
    });
  } catch (error) {
    console.error("Error al obtener permisos:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener los permisos",
    });
  }
};

// Obtener un permiso por ID
exports.obtenerPermisoPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const permiso = await Permiso.findById(id);
    if (!permiso) {
      return res.status(404).json({
        success: false,
        message: "Permiso no encontrado",
      });
    }
    res.status(200).json({
      success: true,
      data: permiso,
    });
  } catch (error) {
    console.error("❌ Error al obtener permiso:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener permiso",
      error: error.message,
    });
  }
};

// Editar un permiso
exports.editarPermiso = async (req, res) => {
  const { id } = req.params;
  try {
    const permiso = await Permiso.findById(id);
    if (!permiso) {
      return res.status(404).json({
        success: false,
        message: "Permiso no encontrado",
      });
    }

    // Actualizamos los datos del permiso
    const { nombre, descripcion, fecha } = req.body;
    permiso.nombre = nombre || permiso.nombre;
    permiso.descripcion = descripcion || permiso.descripcion;
    permiso.fecha = fecha || permiso.fecha;

    // Si se subió una nueva foto, actualizamos la ruta de la foto (solo el nombre)
    if (req.file) {
      permiso.foto = req.file.filename; // Guardamos solo el nombre de la nueva foto
    }

    // Guardamos los cambios en la base de datos
    await permiso.save();

    res.status(200).json({
      success: true,
      message: "Permiso actualizado exitosamente",
      data: permiso,
    });
  } catch (error) {
    console.error("❌ Error al editar permiso:", error);
    res.status(500).json({
      success: false,
      message: "Error al editar permiso",
      error: error.message,
    });
  }
};

// Eliminar un permiso
exports.eliminarPermiso = async (req, res) => {
  const { id } = req.params;
  try {
    const permiso = await Permiso.findById(id);
    if (!permiso) {
      return res.status(404).json({
        success: false,
        message: "Permiso no encontrado",
      });
    }

    // Eliminar el permiso
    await permiso.remove();

    res.status(200).json({
      success: true,
      message: "Permiso eliminado exitosamente",
    });
  } catch (error) {
    console.error("❌ Error al eliminar permiso:", error);
    res.status(500).json({
      success: false,
      message: "Error al eliminar permiso",
      error: error.message,
    });
  }
};
