const Permiso = require("../models/Permiso");
const path = require("path");
const fs = require("fs");

// 📌 Crear permiso
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

// 📌 Obtener todos los permisos
exports.obtenerPermisos = async (req, res) => {
  try {
    const permisos = await Permiso.find()
      .populate("id_proyecto", "nombre")  // Asegúrate de que 'id_proyecto' sea una referencia válida
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

// 📌 Obtener un permiso por ID
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

// 📌 Editar permiso (descripción, proyecto y reemplazo opcional de la foto)
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
    const { tipo, numero_permiso, fecha_emision, fecha_vencimiento, id_proyecto } = req.body;
    permiso.tipo = tipo || permiso.tipo;
    permiso.numero_permiso = numero_permiso || permiso.numero_permiso;
    permiso.fecha_emision = fecha_emision || permiso.fecha_emision;
    permiso.fecha_vencimiento = fecha_vencimiento || permiso.fecha_vencimiento;
    permiso.id_proyecto = id_proyecto || permiso.id_proyecto;

    // Si se sube una nueva foto, actualizamos la foto
    if (req.file) {
      const fotoPath = path.join(__dirname, "../media/fotos", permiso.foto);
      
      // Eliminar la foto anterior, si existe
      if (fs.existsSync(fotoPath)) {
        fs.unlink(fotoPath, (err) => {
          if (err) {
            console.error("❌ Error al eliminar la foto anterior:", err);
          }
        });
      }

      // Actualizamos el nombre de la nueva foto
      permiso.foto = req.file.filename;
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

// 📌 Eliminar permiso
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

    // Eliminar el archivo de la foto del sistema de archivos
    if (permiso.foto) {
      const fotoPath = path.join(__dirname, "../media/fotos", permiso.foto);
      
      // Intentar eliminar la foto
      await fs.promises.unlink(fotoPath);
      console.log("✅ Foto eliminada del servidor:", permiso.foto);
    }

    // Eliminar el permiso de la base de datos
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
