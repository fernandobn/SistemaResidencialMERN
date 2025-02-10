import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { obtenerUbicacionPorId, actualizarUbicacion } from "../services/ubicacionService";
import { useForm } from "react-hook-form";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const EditarUbicacion = () => {
  const { id } = useParams();  // Obtén el id desde la URL
  const [ubicacion, setUbicacion] = useState(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const navigate = useNavigate();

  // Función para obtener la ubicación
  const fetchUbicacion = async () => {
    try {
      const data = await obtenerUbicacionPorId(id);  // Usar la función correcta
      setUbicacion(data);
      reset(data);  // Resetea el formulario con los datos obtenidos
    } catch (error) {
      console.error("Error al obtener la ubicación:", error);
      iziToast.error({
        title: "Error",
        message: "No se pudo obtener la ubicación.",
        position: "topRight",
      });
    }
  };

  // Cargar la ubicación cuando el componente se monta
  useEffect(() => {
    fetchUbicacion();
  }, [id]);

  // Función para manejar el envío del formulario
  const onSubmit = async (data) => {
    try {
      await actualizarUbicacion(id, data);
      iziToast.success({
        title: "Éxito",
        message: "Ubicación actualizada con éxito.",
        position: "topRight",
      });
      navigate("/listarUbicaciones");  // Redirige a la lista de ubicaciones
    } catch (error) {
      iziToast.error({
        title: "Error",
        message: "No se pudo actualizar la ubicación.",
        position: "topRight",
      });
      console.error("Error al actualizar la ubicación:", error);
    }
  };

  // Si no se ha cargado la ubicación aún, mostrar un mensaje de carga
  if (!ubicacion) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-3">Cargando ubicación...</p>
      </div>
    );
  }

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow-lg p-4" style={{ maxWidth: "600px", width: "100%" }}>
        <h3 className="text-center mb-4 text-primary">Editar Ubicación</h3>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Dirección */}
          <div className="mb-3">
            <label className="form-label">Dirección</label>
            <input
              type="text"
              name="direccion"
              className={`form-control ${errors.direccion ? "is-invalid" : ""}`}
              placeholder="Ej. Calle Principal #123"
              {...register("direccion", { required: "Por favor ingrese la dirección." })}
            />
            {errors.direccion && <div className="invalid-feedback">{errors.direccion.message}</div>}
          </div>

          {/* Ciudad */}
          <div className="mb-3">
            <label className="form-label">Ciudad</label>
            <input
              type="text"
              name="ciudad"
              className={`form-control ${errors.ciudad ? "is-invalid" : ""}`}
              placeholder="Ej. Madrid"
              {...register("ciudad", { required: "Por favor ingrese la ciudad." })}
            />
            {errors.ciudad && <div className="invalid-feedback">{errors.ciudad.message}</div>}
          </div>

          {/* Estado */}
          <div className="mb-3">
            <label className="form-label">Estado</label>
            <input
              type="text"
              name="estado"
              className={`form-control ${errors.estado ? "is-invalid" : ""}`}
              placeholder="Ej. Comunidad de Madrid"
              {...register("estado", { required: "Por favor ingrese el estado." })}
            />
            {errors.estado && <div className="invalid-feedback">{errors.estado.message}</div>}
          </div>

          {/* Código Postal */}
          <div className="mb-3">
            <label className="form-label">Código Postal</label>
            <input
              type="text"
              name="codigo_postal"
              className={`form-control ${errors.codigo_postal ? "is-invalid" : ""}`}
              placeholder="Ej. 28001"
              {...register("codigo_postal", { required: "Por favor ingrese el código postal." })}
            />
            {errors.codigo_postal && <div className="invalid-feedback">{errors.codigo_postal.message}</div>}
          </div>

          {/* País */}
          <div className="mb-3">
            <label className="form-label">País</label>
            <input
              type="text"
              name="pais"
              className={`form-control ${errors.pais ? "is-invalid" : ""}`}
              placeholder="Ej. España"
              {...register("pais", { required: "Por favor ingrese el país." })}
            />
            {errors.pais && <div className="invalid-feedback">{errors.pais.message}</div>}
          </div>

          {/* Botón de Guardar */}
          <button type="submit" className="btn btn-primary w-100">
            Actualizar Ubicación
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditarUbicacion;
