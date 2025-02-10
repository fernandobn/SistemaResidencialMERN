import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; 
import { useForm } from "react-hook-form";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import { obtenerPermisoPorId, actualizarPermiso } from "../services/permisoService";
import { listarProyectos } from "../services/proyectoService";

const EditarPermiso = () => {
  const { id: permisoId } = useParams(); 
  const navigate = useNavigate(); 
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();
  
  const [proyectos, setProyectos] = useState([]);
  const [fotoPrevia, setFotoPrevia] = useState(null);
  const [fotoExistente, setFotoExistente] = useState(""); 
  const [subiendo, setSubiendo] = useState(false);

  useEffect(() => {
    if (!permisoId) {
      iziToast.error({
        title: "Error",
        message: "ID de permiso no válido.",
        position: "topRight",
      });
      return;
    }

    listarProyectos()
      .then((data) => {
        setProyectos(data);
        return obtenerPermisoPorId(permisoId);
      })
      .then(({ success, data }) => {
        if (success) {
          const permiso = data.data;
          setValue("tipo", permiso.tipo);
          setValue("numero_permiso", permiso.numero_permiso);
          setValue("fecha_emision", permiso.fecha_emision.split("T")[0]);
          setValue("fecha_vencimiento", permiso.fecha_vencimiento?.split("T")[0] || "");
          setValue("id_proyecto", permiso.id_proyecto);

          // Guardar la foto existente
          setFotoExistente(permiso.foto || "");
          setFotoPrevia(permiso.foto ? `http://localhost:5000/media/permisos/${permiso.foto}` : null);
        } else {
          throw new Error("Error al obtener los datos del permiso.");
        }
      })
      .catch((error) => {
        console.error("Error al cargar el permiso o proyectos:", error);
        iziToast.error({
          title: "Error",
          message: "No se pudo cargar el permiso o los proyectos.",
          position: "topRight",
        });
      });
  }, [permisoId, setValue]);

  const onSubmit = async (data) => {
    const formData = new FormData();
  
    formData.append("tipo", data.tipo);
    formData.append("numero_permiso", data.numero_permiso);
    formData.append("fecha_emision", data.fecha_emision);
    formData.append("fecha_vencimiento", data.fecha_vencimiento || "");
    formData.append("id_proyecto", data.id_proyecto);
  
    // Verifica si se ha seleccionado una nueva foto
    if (data.foto && data.foto.length > 0) {
      formData.append("foto", data.foto[0]); 
    } else {
      formData.append("fotoExistente", fotoExistente); // Enviar la foto actual si no se sube una nueva
    }
  
    console.log("🚀 Datos enviados al backend:", formData);
  
    setSubiendo(true);
    try {
      const result = await actualizarPermiso(permisoId, formData);
  
      if (result.success) {
        iziToast.success({
          title: "Éxito",
          message: "Permiso actualizado correctamente.",
          position: "topRight",
        });
        reset();
        navigate("/listarPermisos");
      } else {
        iziToast.error({
          title: "Error",
          message: result.message || "No se pudo actualizar el permiso.",
          position: "topRight",
        });
      }
    } catch (error) {
      console.error("Error al actualizar el permiso:", error);
      iziToast.error({
        title: "Error",
        message: "No se pudo actualizar el permiso. Verifique la consola para más detalles.",
        position: "topRight",
      });
    } finally {
      setSubiendo(false);
    }
  };

  return (
    <main className="main" style={{ marginTop: "80px", backgroundColor: "#f9f9f9" }}>
      <div className="container d-flex justify-content-center align-items-center vh-100">
        <div
          className="card shadow-lg p-4"
          style={{
            borderRadius: "12px",
            maxWidth: "900px",
            width: "100%",
          }}
        >
          <h3 className="text-center mb-4 text-primary">Editar Permiso</h3>
          <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Tipo de Permiso</label>
                <input
                  type="text"
                  className={`form-control ${errors.tipo ? "is-invalid" : ""}`}
                  placeholder="Ejemplo: Construcción"
                  {...register("tipo", { required: "Por favor ingrese el tipo de permiso." })}
                />
                {errors.tipo && <div className="invalid-feedback">{errors.tipo.message}</div>}
              </div>
              <div className="col-md-6">
                <label className="form-label">Número de Permiso</label>
                <input
                  type="text"
                  className={`form-control ${errors.numero_permiso ? "is-invalid" : ""}`}
                  placeholder="Ejemplo: 123456"
                  {...register("numero_permiso", { required: "Por favor ingrese el número de permiso." })}
                />
                {errors.numero_permiso && <div className="invalid-feedback">{errors.numero_permiso.message}</div>}
              </div>
            </div>

            <div className="row g-3 mt-3">
              <div className="col-md-6">
                <label className="form-label">Fecha de Emisión</label>
                <input
                  type="date"
                  className={`form-control ${errors.fecha_emision ? "is-invalid" : ""}`}
                  {...register("fecha_emision", { required: "Por favor ingrese la fecha de emisión." })}
                />
                {errors.fecha_emision && <div className="invalid-feedback">{errors.fecha_emision.message}</div>}
              </div>
              <div className="col-md-6">
                <label className="form-label">Fecha de Vencimiento</label>
                <input type="date" className="form-control" {...register("fecha_vencimiento")} />
              </div>
            </div>

            <div className="row g-3 mt-3">
              <div className="col-md-6">
                <label className="form-label">Proyecto</label>
                <select
                  className="form-control"
                  {...register("id_proyecto", { required: "Por favor seleccione un proyecto." })}
                >
                  <option value="">Seleccione un proyecto</option>
                  {proyectos.map((proyecto) => (
                    <option key={proyecto._id} value={proyecto._id}>
                      {proyecto.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label">Foto</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="form-control" 
                  {...register("foto")} 
                />
                <small className="text-muted">Foto actual: {fotoExistente || "No hay foto"}</small>
              </div>
            </div>

            <div className="d-flex justify-content-center mt-4">
              <button type="submit" className="btn btn-primary px-4" disabled={subiendo}>
                {subiendo ? "Guardando..." : "Actualizar Cambios"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default EditarPermiso;
