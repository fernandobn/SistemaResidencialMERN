import API from "../api"; // Asegúrate de que la ruta sea correcta

// Obtener todos los presupuestos
export const obtenerPresupuestos = async () => {
  try {
    const response = await API.get('/presupuestos');
    return { success: true, data: response.data };
  } catch (error) {
    console.error("🚨 Error al obtener los presupuestos:", error);
    return { success: false, message: "Error al obtener los presupuestos", error };
  }
};

// Obtener un presupuesto por ID
export const obtenerPresupuestoPorId = async (id) => {
  try {
    const response = await API.get(`/presupuestos/${id}`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("🚨 Error al obtener presupuesto:", error);
    return { success: false, message: "Error al obtener presupuesto", error };
  }
};

// Crear un nuevo presupuesto
export const guardarPresupuesto = async (presupuestoData) => {
  try {
    const response = await API.post('/presupuestos', presupuestoData);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("🚨 Error al crear presupuesto:", error);
    return { success: false, message: "Error al crear presupuesto", error };
  }
};

// Actualizar un presupuesto
export const actualizarPresupuesto = async (id, presupuestoData) => {
  try {
    const response = await API.put(`/presupuestos/${id}`, presupuestoData);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("🚨 Error al actualizar presupuesto:", error);
    return { success: false, message: "Error al actualizar presupuesto", error };
  }
};

// Eliminar un presupuesto
export const eliminarPresupuesto = async (id) => {
  try {
    const response = await API.delete(`/presupuestos/${id}`);
    return { success: true, message: "Presupuesto eliminado exitosamente." };
  } catch (error) {
    console.error("🚨 Error al eliminar presupuesto:", error);
    return { success: false, message: "Error al eliminar presupuesto", error };
  }
};