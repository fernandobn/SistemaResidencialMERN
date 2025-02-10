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

// Actualizar un permiso
export const actualizarPermiso = async (id, permisoData) => {
  try {
    const formData = new FormData();
    for (const key in permisoData) {
      formData.append(key, permisoData[key]);
      console.log(`📝 Agregando al FormData: ${key} = ${permisoData[key]}`);
    }

    console.log("🚀 Datos enviados al backend:", permisoData);

    const response = await API.put(`/permisos/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    console.log("✅ Permiso actualizado exitosamente:", response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("❌ Error al actualizar permiso:", error);
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
