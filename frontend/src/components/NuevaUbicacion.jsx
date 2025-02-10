import React from "react";
import { useForm } from "react-hook-form";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import { guardarUbicacion } from "../services/ubicacionService";  // Servicio que definiremos a continuación

const NuevaUbicacion = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await guardarUbicacion(data);
      iziToast.success({
        title: "Éxito",
        message: "Ubicación guardada con éxito.",
        position: "topRight",
      });
      reset();
    } catch (error) {
      iziToast.error({
        title: "Error",
        message: "No se pudo guardar la ubicación.",
        position: "topRight",
      });
      console.error("🚨 Error al guardar la ubicación:", error);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow-lg p-4" style={{ maxWidth: "600px", width: "100%" }}>
        <h3 className="text-center mb-4 text-primary">Registrar Ubicación</h3>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Dirección */}
          <div className="mb-3">
            <label className="form-label">Ingrese la Dirección</label>
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
            <label className="form-label">Ingrese la Ciudad</label>
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
            <label className="form-label">Ingrese el Estado</label>
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
            <label className="form-label">Ingrese el Código Postal</label>
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
            <label className="form-label">Ingrese el País</label>
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
            Guardar Ubicación
          </button>
        </form>
      </div>
    </div>
  );
};

export default NuevaUbicacion;
