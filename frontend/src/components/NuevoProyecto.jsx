import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { guardarProyecto } from "../services/proyectoService";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import { useNavigate } from "react-router-dom";
import { listarUbicaciones } from "../services/ubicacionService"; // Asegúrate de tener esta función

const NuevoProyecto = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  const [ubicaciones, setUbicaciones] = useState([]);

  // Cargar las ubicaciones disponibles
  useEffect(() => {
    const fetchUbicaciones = async () => {
      try {
        const ubicacionesList = await listarUbicaciones();
        setUbicaciones(ubicacionesList);
      } catch (error) {
        console.error("🚨 Error al obtener las ubicaciones:", error);
        iziToast.error({
          title: "Error",
          message: "No se pudo cargar las ubicaciones.",
          position: "topRight",
        });
      }
    };
    fetchUbicaciones();
  }, []);

  const onSubmit = async (data) => {
    try {
      // Validación adicional en el cliente si es necesario
      if (!data.id_ubicacion) {
        iziToast.error({
          title: "Error",
          message: "Por favor, seleccione una ubicación válida.",
          position: "topRight",
        });
        return;
      }

      await guardarProyecto(data);
      iziToast.success({
        title: "Éxito",
        message: "Proyecto guardado con éxito.",
        position: "topRight",
      });
      reset();
      navigate("/listarProyectos");
    } catch (error) {
      iziToast.error({
        title: "Error",
        message: "No se pudo guardar el proyecto.",
        position: "topRight",
      });
      console.error("🚨 Error al guardar el proyecto:", error);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow-lg p-4" style={{ maxWidth: "600px", width: "100%" }}>
        <h3 className="text-center mb-4 text-primary">Registrar Proyecto</h3>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Nombre del Proyecto */}
          <div className="mb-3">
            <label className="form-label">Nombre del Proyecto</label>
            <input
              type="text"
              name="nombre"
              className={`form-control ${errors.nombre ? "is-invalid" : ""}`}
              placeholder="Ej. Proyecto A"
              {...register("nombre", { required: "Por favor ingrese el nombre del proyecto." })}
            />
            {errors.nombre && <div className="invalid-feedback">{errors.nombre.message}</div>}
          </div>

          {/* Descripción */}
          <div className="mb-3">
            <label className="form-label">Descripción</label>
            <textarea
              name="descripcion"
              className={`form-control ${errors.descripcion ? "is-invalid" : ""}`}
              placeholder="Descripción del proyecto"
              {...register("descripcion", { required: "Por favor ingrese una descripción." })}
            ></textarea>
            {errors.descripcion && <div className="invalid-feedback">{errors.descripcion.message}</div>}
          </div>

          {/* Fecha de Inicio */}
          <div className="mb-3">
            <label className="form-label">Fecha de Inicio</label>
            <input
              type="date"
              name="fecha_inicio"
              className={`form-control ${errors.fecha_inicio ? "is-invalid" : ""}`}
              {...register("fecha_inicio", { required: "Por favor ingrese la fecha de inicio." })}
            />
            {errors.fecha_inicio && <div className="invalid-feedback">{errors.fecha_inicio.message}</div>}
          </div>

          {/* Fecha de Fin */}
          <div className="mb-3">
            <label className="form-label">Fecha de Fin</label>
            <input
              type="date"
              name="fecha_fin"
              className="form-control"
              {...register("fecha_fin")}
            />
          </div>

          {/* Ubicación */}
          <div className="mb-3">
            <label className="form-label">Ubicación</label>
            <select
              name="id_ubicacion"
              className={`form-control ${errors.id_ubicacion ? "is-invalid" : ""}`}
              {...register("id_ubicacion", { required: "Por favor seleccione una ubicación." })}
            >
              <option value="">Seleccione una ubicación</option>
              {ubicaciones.map((ubicacion) => (
                // Usamos el '_id' de MongoDB como clave única
                <option key={ubicacion._id} value={ubicacion._id}>
                  {ubicacion.direccion}, {ubicacion.ciudad}, {ubicacion.estado}, {ubicacion.pais}
                </option>
              ))}
            </select>

            {errors.id_ubicacion && <div className="invalid-feedback">{errors.id_ubicacion.message}</div>}
          </div>

          {/* Botón de Guardar */}
          <button type="submit" className="btn btn-primary w-100">
            Guardar Proyecto
          </button>
        </form>
      </div>
    </div>
  );
};

export default NuevoProyecto;
