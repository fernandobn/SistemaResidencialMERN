import API from "../api"; // Asegúrate de que la ruta sea correcta

// Guardar un nuevo proyecto
export const guardarProyecto = async (data) => {
  try {
    // Validación de campos requeridos
    if (!data.nombre || !data.descripcion || !data.fecha_inicio || !data.id_ubicacion) {
      throw new Error("Faltan campos requeridos");
    }

    // Validación de fecha
    const fechaInicio = new Date(data.fecha_inicio);
    if (isNaN(fechaInicio.getTime())) {
      throw new Error("Fecha de inicio inválida");
    }

    const fechaFin = data.fecha_fin ? new Date(data.fecha_fin) : null;
    if (fechaFin && isNaN(fechaFin.getTime())) {
      throw new Error("Fecha de fin inválida");
    }

    console.log("Datos a guardar:", data);

    const response = await API.post("/proyectos", data);
    return response.data;
  } catch (error) {
    console.error("🚨 Error al guardar el proyecto:", error.message || error);
    throw error;
  }
};


// Obtener todos los proyectos
export const listarProyectos = async () => {
  try {
    const { data } = await API.get("/proyectos");
    return data; // Retorna los datos de los proyectos
  } catch (error) {
    console.error("🚨 Error al listar proyectos:", error);
    throw error;
  }
};

// Obtener un proyecto por ID
export const obtenerProyectoPorId = async (id) => {
  try {
    const { data } = await API.get(`/proyectos/${id}`);
    return data; // Retorna los datos del proyecto
  } catch (error) {
    console.error("🚨 Error al obtener el proyecto:", error);
    throw error;
  }
};

// Actualizar un proyecto
export const actualizarProyecto = async (id, proyectoData) => {
  try {
    const { data } = await API.put(`/proyectos/${id}`, proyectoData);
    return data; // Retorna el proyecto actualizado
  } catch (error) {
    console.error("🚨 Error al actualizar el proyecto:", error);
    throw error;
  }
};

// Eliminar un proyecto
export const eliminarProyecto = async (id) => {
  try {
    const response = await API.delete(`/proyectos/${id}`);
    if (response.status === 200) {
      return { message: 'Proyecto eliminado correctamente' };
    }
    return response.data;  // En caso de que el servidor retorne algo.
  } catch (error) {
    console.error("🚨 Error al eliminar el proyecto:", error);
    throw error;
  }
};
