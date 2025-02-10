import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { guardarPresupuesto } from "../services/presupuestoService";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import { useNavigate } from "react-router-dom";
import { listarProyectos } from "../services/proyectoService"; // Asegúrate de tener esta función

const NuevoPresupuesto = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  const [proyectos, setProyectos] = useState([]);

  // Cargar los proyectos disponibles
  useEffect(() => {
    const fetchProyectos = async () => {
      try {
        const proyectosList = await listarProyectos();
        setProyectos(proyectosList);
      } catch (error) {
        console.error("🚨 Error al obtener los proyectos:", error);
        iziToast.error({
          title: "Error",
          message: "No se pudo cargar los proyectos.",
          position: "topRight",
        });
      }
    };
    fetchProyectos();
  }, []);

  const onSubmit = async (data) => {
    try {
      // Validación adicional en el cliente si es necesario
      if (!data.id_proyecto) {
        iziToast.error({
          title: "Error",
          message: "Por favor, seleccione un proyecto válido.",
          position: "topRight",
        });
        return;
      }

      await guardarPresupuesto(data);
      iziToast.success({
        title: "Éxito",
        message: "Presupuesto guardado con éxito.",
        position: "topRight",
      });
      reset();
      navigate("/listarPresupuestos");
    } catch (error) {
      iziToast.error({
        title: "Error",
        message: "No se pudo guardar el presupuesto.",
        position: "topRight",
      });
      console.error("🚨 Error al guardar el presupuesto:", error);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow-lg p-4" style={{ maxWidth: "600px", width: "100%" }}>
        <h3 className="text-center mb-4 text-primary">Registrar Presupuesto</h3>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Monto Total */}
          <div className="mb-3">
            <label className="form-label">Monto Total</label>
            <input
              type="number"
              name="monto_total"
              className={`form-control ${errors.monto_total ? "is-invalid" : ""}`}
              placeholder="Monto Total"
              {...register("monto_total", { required: "Por favor ingrese el monto total." })}
            />
            {errors.monto_total && <div className="invalid-feedback">{errors.monto_total.message}</div>}
          </div>

          {/* Monto Utilizado */}
          <div className="mb-3">
            <label className="form-label">Monto Utilizado</label>
            <input
              type="number"
              name="monto_utilizado"
              className={`form-control ${errors.monto_utilizado ? "is-invalid" : ""}`}
              placeholder="Monto Utilizado"
              {...register("monto_utilizado")}
            />
            {errors.monto_utilizado && <div className="invalid-feedback">{errors.monto_utilizado.message}</div>}
          </div>

          {/* Fecha de Aprobación */}
          <div className="mb-3">
            <label className="form-label">Fecha de Aprobación</label>
            <input
              type="date"
              name="fecha_aprobacion"
              className={`form-control ${errors.fecha_aprobacion ? "is-invalid" : ""}`}
              {...register("fecha_aprobacion", { required: "Por favor ingrese la fecha de aprobación." })}
            />
            {errors.fecha_aprobacion && <div className="invalid-feedback">{errors.fecha_aprobacion.message}</div>}
          </div>

          {/* Proyecto */}
          <div className="mb-3">
            <label className="form-label">Proyecto</label>
            <select
              name="id_proyecto"
              className={`form-control ${errors.id_proyecto ? "is-invalid" : ""}`}
              {...register("id_proyecto", { required: "Por favor seleccione un proyecto." })}
            >
              <option value="">Seleccione un proyecto</option>
              {proyectos.map((proyecto) => (
                <option key={proyecto._id} value={proyecto._id}>
                  {proyecto.nombre}
                </option>
              ))}
            </select>
            {errors.id_proyecto && <div className="invalid-feedback">{errors.id_proyecto.message}</div>}
          </div>

          {/* Botón de Guardar */}
          <button type="submit" className="btn btn-primary w-100">
            Guardar Presupuesto
          </button>
        </form>
      </div>
    </div>
  );
};

export default NuevoPresupuesto;
