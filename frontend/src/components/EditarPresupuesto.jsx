import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { obtenerPresupuestoPorId, actualizarPresupuesto } from "../services/presupuestoService";
import { listarProyectos } from "../services/proyectoService";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const EditarPresupuesto = () => {
  const { id } = useParams(); // Este ID viene de la URL
  const navigate = useNavigate();
  const [proyectos, setProyectos] = useState([]);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    console.log("ID recibido en frontend:", id);
    const fetchData = async () => {
      try {
        const presupuestoData = await obtenerPresupuestoPorId(id);
        if (presupuestoData && presupuestoData.data) {
          const fechaAprobacion = presupuestoData.data.fecha_aprobacion?.slice(0, 10);

          // Asignar los datos del presupuesto, incluyendo el proyecto seleccionado
          if (presupuestoData.data.id_proyecto) {
            reset({
              ...presupuestoData.data,
              fecha_aprobacion: fechaAprobacion,
            });
            setValue("id_proyecto", presupuestoData.data.id_proyecto._id);  // MongoDB _id del proyecto
          } else {
            iziToast.error({
              title: "Error",
              message: "El proyecto asociado no está disponible.",
              position: "topRight",
            });
          }
        }
        setProyectos(await listarProyectos());
      } catch (error) {
        console.error("🚨 Error al obtener el presupuesto o proyectos:", error);
        iziToast.error({
          title: "Error",
          message: "No se pudo cargar los datos.",
          position: "topRight",
        });
      }
    };
    fetchData();
  }, [id, reset, setValue]);

  const onSubmit = async (data) => {
    try {
      if (!data.id_proyecto) {
        iziToast.error({
          title: "Error",
          message: "Por favor, seleccione un proyecto válido.",
          position: "topRight",
        });
        return;
      }

      // Solo se actualiza con id_proyecto, sin ningún id_presupuesto
      await actualizarPresupuesto(id, data);
      iziToast.success({
        title: "Éxito",
        message: "Presupuesto actualizado con éxito.",
        position: "topRight",
      });
      navigate("/listarPresupuestos");
    } catch (error) {
      iziToast.error({
        title: "Error",
        message: "No se pudo actualizar el presupuesto.",
        position: "topRight",
      });
      console.error("🚨 Error al guardar el presupuesto:", error);
    }
  };

  if (!proyectos.length) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-3">Cargando datos...</p>
      </div>
    );
  }

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow-lg p-4" style={{ maxWidth: "600px", width: "100%" }}>
        <h3 className="text-center mb-4 text-primary">Editar Presupuesto</h3>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input type="hidden" {...register("_id")} /> {/* El _id sigue siendo necesario solo si quieres mantenerlo */}

          <div className="mb-3">
            <label className="form-label">Monto Total</label>
            <input
              type="number"
              className={`form-control ${errors.monto_total ? "is-invalid" : ""}`}
              placeholder="Monto Total"
              {...register("monto_total", { required: "Ingrese el monto total." })}
            />
            {errors.monto_total && <div className="invalid-feedback">{errors.monto_total.message}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Monto Utilizado</label>
            <input type="number" className="form-control" placeholder="Monto Utilizado" {...register("monto_utilizado")} />
          </div>

          <div className="mb-3">
            <label className="form-label">Fecha de Aprobación</label>
            <input
              type="date"
              className={`form-control ${errors.fecha_aprobacion ? "is-invalid" : ""}`}
              {...register("fecha_aprobacion", { required: "Ingrese la fecha de aprobación." })}
            />
            {errors.fecha_aprobacion && <div className="invalid-feedback">{errors.fecha_aprobacion.message}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Proyecto</label>
            <select
              className="form-select"
              {...register("id_proyecto", { required: "Seleccione un proyecto." })}
            >
              <option value="">Seleccione un Proyecto</option>
              {proyectos.map((proyecto) => (
                <option key={proyecto._id} value={proyecto._id}>
                  {proyecto.nombre}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Actualizar Presupuesto
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditarPresupuesto;
