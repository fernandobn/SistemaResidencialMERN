import API from "../api"; // Asegúrate de que la ruta sea correcta

// Obtener todos los permisos
export const obtenerPermisos = async () => {
  try {
    const response = await API.get("/permisos");
    console.log("🚀 Respuesta al obtener permisos:", response.data);
    return { success: true, data: response.data }; // Devolver la data correctamente
  } catch (error) {
    console.error("🚨 Error al obtener los permisos:", error);
    return { success: false, message: "Error al obtener los permisos", error: error.message };
  }
};

// Obtener un permiso por ID
export const obtenerPermisoPorId = async (id) => {
  try {
    const response = await API.get(`/permisos/${id}`);
    console.log("🚀 Permiso obtenido:", response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("🚨 Error al obtener permiso:", error);
    return { success: false, message: "Error al obtener permiso", error };
  }
};

export const actualizarPermiso = async (id, permisoData) => {
  try {
    const formData = new FormData();

    // 📌 Agregar datos correctamente
    for (const key in permisoData) {
      if (key === "foto" && permisoData[key] instanceof File) {
        formData.append("foto", permisoData[key]); // Adjuntar nueva foto si existe
      } else if (key === "fotoExistente") {
        formData.append("fotoExistente", permisoData[key]); // Adjuntar foto actual si no se cambia
      } else {
        formData.append(key, permisoData[key]); // Adjuntar otros datos
      }
    }

    console.log("🚀 Enviando al backend:", Object.fromEntries(formData.entries())); 

    const response = await fetch(`https://backendmern-pcor.onrender.com/api/permisos/${id}`, {
      method: "PUT",
      body: formData, 
    });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();
    console.log("🚀 Permiso actualizado:", data);
    return { success: true, data };
  } catch (error) {
    console.error("🚨 Error al actualizar permiso:", error);
    return { success: false, message: "Error al actualizar permiso", error };
  }
};


// Crear un permiso
export const guardarPermiso = async (formData) => {
  try {
    const response = await API.post('/permisos', formData); // Usar '/api/permisos' en lugar de '/permisos'
    return { success: true, data: response.data };
  } catch (error) {
    console.error("🚨 Error al crear permiso:", error);
    return { success: false, message: "Error al crear permiso", error };
  }
};


// Eliminar un permiso por ID
export const eliminarPermiso = async (id) => {
  try {
    const response = await API.delete(`/permisos/${id}`);
    console.log("✅ Permiso eliminado:", response.data);
    return { success: true, message: "Permiso eliminado exitosamente" };
  } catch (error) {
    console.error("🚨 Error al eliminar permiso:", error);
    return { success: false, message: "Error al eliminar permiso", error };
  }
};
