import API from "../api"; // Asegúrate de que la ruta sea correcta

// Guardar una nueva ubicación

export const guardarUbicacion = async (data) => {
  try {
    const response = await API.post('/ubicaciones', data);
    return response.data;
  } catch (error) {
    console.error("🚨 Error al guardar la ubicación:", error);
    throw error;
  }
};


// Obtener todas las ubicaciones
export const listarUbicaciones = async () => {
  const response = await API.get("/ubicaciones");
  return response.data; // Retorna los datos de las ubicaciones
};

// Eliminar una ubicación
export const eliminarUbicacion = async (id) => {
  const response = await API.delete(`/ubicaciones/${id}`);
  return response.data;
};

// Actualizar una ubicación
export const actualizarUbicacion = async (id, ubicacionData) => {
  const response = await API.put(`/ubicaciones/${id}`, ubicacionData);
  return response.data; // Retorna la ubicación actualizada
};

// Obtener una ubicación por ID
export const obtenerUbicacionPorId = async (id) => {
  const response = await API.get(`/ubicaciones/${id}`);
  return response.data; // Retorna los datos de la ubicación
};
