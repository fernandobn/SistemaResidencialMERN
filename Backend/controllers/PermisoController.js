import Permiso from "../models/Permiso.js"; 
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// Convertir `__dirname` en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 📌 Crear Permiso
export const crearPermiso = async (req, res) => {
  try {
    const { tipo, numero_permiso, fecha_emision, fecha_vencimiento, id_proyecto, fotoBase64 } = req.body;

    let foto = null;
    
    if (fotoBase64) {
      // Guardar la imagen en el servidor
      const buffer = Buffer.from(fotoBase64.split(",")[1], "base64");
      foto = `permiso_${Date.now()}.png`;
      const imagePath = path.join(__dirname, "../media/permisos", foto);
      fs.writeFileSync(imagePath, buffer);
    }

    const nuevoPermiso = new Permiso({
      tipo,
      numero_permiso,
      fecha_emision,
      fecha_vencimiento,
      id_proyecto,
      foto,
    });

    await nuevoPermiso.save();

    res.status(201).json({
      success: true,
      message: "Permiso creado exitosamente",
      data: nuevoPermiso,
    });
  } catch (error) {
    console.error("❌ Error al crear permiso:", error);
    res.status(500).json({ success: false, message: "Error al crear permiso", error: error.message });
  }
};

// 📌 Obtener Todos los Permisos
export const obtenerPermisos = async (req, res) => {
  try {
    const permisos = await Permiso.find().populate("id_proyecto", "nombre").exec();
    res.json({ success: true, data: permisos });
  } catch (error) {
    console.error("❌ Error al obtener permisos:", error);
    res.status(500).json({ success: false, message: "Error al obtener los permisos" });
  }
};

// 📌 Obtener Permiso por ID
export const obtenerPermisoPorId = async (req, res) => {
  const { id } = req.params;

  if (!id || id.length !== 24) {
    return res.status(400).json({ success: false, message: "ID inválido proporcionado." });
  }

  try {
    const permiso = await Permiso.findById(id);
    if (!permiso) {
      return res.status(404).json({ success: false, message: "Permiso no encontrado" });
    }
    res.status(200).json({ success: true, data: permiso });
  } catch (error) {
    console.error("❌ Error al obtener permiso:", error);
    res.status(500).json({ success: false, message: "Error al obtener permiso", error: error.message });
  }
};

// 📌 Editar Permiso
export const editarPermiso = async (req, res) => {
  const { id } = req.params;

  console.log("📡 Headers recibidos:", req.headers);
  console.log("📡 req.body recibido:", req.body);

  try {
    const permiso = await Permiso.findById(id);
    if (!permiso) {
      return res.status(404).json({ success: false, message: "Permiso no encontrado" });
    }

    const { tipo, numero_permiso, fecha_emision, fecha_vencimiento, id_proyecto, fotoBase64, fotoExistente } = req.body;

    permiso.tipo = tipo || permiso.tipo;
    permiso.numero_permiso = numero_permiso || permiso.numero_permiso;
    permiso.fecha_emision = fecha_emision || permiso.fecha_emision;
    permiso.fecha_vencimiento = fecha_vencimiento || permiso.fecha_vencimiento;
    permiso.id_proyecto = id_proyecto || permiso.id_proyecto;

    // 📸 Manejo de imagen
    if (fotoBase64) {
      const buffer = Buffer.from(fotoBase64.split(",")[1], "base64");
      const nuevoNombre = `permiso_${Date.now()}.png`;
      const imagePath = path.join(__dirname, "../media/permisos", nuevoNombre);

      fs.writeFileSync(imagePath, buffer);

      if (permiso.foto && permiso.foto !== fotoExistente) {
        const oldPath = path.join(__dirname, "../media/permisos", permiso.foto);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }

      permiso.foto = nuevoNombre;
    } else {
      permiso.foto = fotoExistente;
    }

    await permiso.save();
    res.status(200).json({ success: true, message: "Permiso actualizado exitosamente", data: permiso });
  } catch (error) {
    console.error("❌ Error al editar permiso:", error);
    res.status(500).json({ success: false, message: "Error al editar permiso", error: error.message });
  }
};


// 📌 Eliminar Permiso
export const eliminarPermiso = async (req, res) => {
  const { id } = req.params;

  try {
    const permiso = await Permiso.findById(id);
    if (!permiso) {
      return res.status(404).json({ success: false, message: "Permiso no encontrado" });
    }

    if (permiso.foto) {
      const fotoPath = path.join(__dirname, "../media/permisos", permiso.foto);
      if (fs.existsSync(fotoPath)) await fs.promises.unlink(fotoPath);
    }

    await permiso.deleteOne();
    return res.status(200).json({ success: true, message: "Permiso eliminado exitosamente" });
  } catch (error) {
    console.error("❌ Error al eliminar permiso:", error);
    return res.status(500).json({ success: false, message: "Error interno del servidor", error: error.message });
  }
};
