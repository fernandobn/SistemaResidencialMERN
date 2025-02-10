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
    setValue,
    formState: { errors },
  } = useForm();

  const [proyectos, setProyectos] = useState([]);
  const [subiendo, setSubiendo] = useState(false);
  const [fotoExistente, setFotoExistente] = useState("");
  const [nuevaFoto, setNuevaFoto] = useState(null);

  useEffect(() => {
    if (!permisoId) {
      iziToast.error({ title: "Error", message: "ID de permiso no válido.", position: "topRight" });
      return;
    }

    listarProyectos()
      .then((data) => setProyectos(data))
      .catch(() =>
        iziToast.error({ title: "Error", message: "No se pudieron cargar los proyectos.", position: "topRight" })
      );

    obtenerPermisoPorId(permisoId)
      .then(({ success, data }) => {
        if (success) {
          const permiso = data.data;
          setValue("tipo", permiso.tipo);
          setValue("numero_permiso", permiso.numero_permiso);
          setValue("fecha_emision", permiso.fecha_emision.split("T")[0]);
          setValue("fecha_vencimiento", permiso.fecha_vencimiento?.split("T")[0] || "");
          setValue("id_proyecto", permiso.id_proyecto);
          setFotoExistente(permiso.foto || ""); // Guarda la foto existente si la hay
        } else {
          throw new Error("Error al obtener los datos del permiso.");
        }
      })
      .catch(() =>
        iziToast.error({ title: "Error", message: "No se pudo cargar el permiso.", position: "topRight" })
      );
  }, [permisoId, setValue]);

  // Manejo del cambio de imagen
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNuevaFoto(reader.result); // Guardamos la imagen en base64
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    setSubiendo(true);

    const permisoData = {
      tipo: data.tipo,
      numero_permiso: data.numero_permiso,
      fecha_emision: data.fecha_emision,
      fecha_vencimiento: data.fecha_vencimiento || "",
      id_proyecto: data.id_proyecto,
      fotoBase64: nuevaFoto || null, // Si hay una nueva imagen, la enviamos, si no, null
      fotoExistente: fotoExistente, // Mantiene la foto si no se sube una nueva
    };

    console.log("🚀 Datos enviados al backend:", JSON.stringify(permisoData, null, 2));

    try {
      const response = await fetch(`https://backendmern-pcor.onrender.com/api/permisos/${permisoId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(permisoData),
      });

      const result = await response.json();
      console.log("📡 Respuesta del servidor:", result);

      if (result.success) {
        iziToast.success({
          title: "Éxito",
          message: "Permiso actualizado correctamente.",
          position: "topRight",
        });
        navigate("/listarPermisos");
      } else {
        iziToast.error({
          title: "Error",
          message: result.message || "No se pudo actualizar el permiso.",
          position: "topRight",
        });
      }
    } catch (error) {
      console.error("❌ Error al actualizar el permiso:", error);
      iziToast.error({
        title: "Error",
        message: "No se pudo actualizar el permiso. Verifique la consola.",
        position: "topRight",
      });
    } finally {
      setSubiendo(false);
    }
  };

  return (
    <main className="main" style={{ marginTop: "80px", backgroundColor: "#f9f9f9" }}>
      <div className="container d-flex justify-content-center align-items-center vh-100">
        <div className="card shadow-lg p-4" style={{ borderRadius: "12px", maxWidth: "900px", width: "100%" }}>
          <h3 className="text-center mb-4 text-primary">Editar Permiso</h3>
          <form onSubmit={handleSubmit(onSubmit)}>

            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Tipo de Permiso</label>
                <input type="text" className={`form-control ${errors.tipo ? "is-invalid" : ""}`} {...register("tipo", { required: "Ingrese el tipo de permiso." })} />
              </div>
              <div className="col-md-6">
                <label className="form-label">Número de Permiso</label>
                <input type="text" className={`form-control ${errors.numero_permiso ? "is-invalid" : ""}`} {...register("numero_permiso", { required: "Ingrese el número de permiso." })} />
              </div>
            </div>

            <div className="row g-3 mt-3">
              <div className="col-md-6">
                <label className="form-label">Fecha de Emisión</label>
                <input type="date" className="form-control" {...register("fecha_emision")} />
              </div>
              <div className="col-md-6">
                <label className="form-label">Fecha de Vencimiento</label>
                <input type="date" className="form-control" {...register("fecha_vencimiento")} />
              </div>
            </div>

            <div className="row g-3 mt-3">
              <div className="col-md-6">
                <label className="form-label">Proyecto</label>
                <select className="form-control" {...register("id_proyecto")}>
                  <option value="">Seleccione un proyecto</option>
                  {proyectos.map((proyecto) => (
                    <option key={proyecto._id} value={proyecto._id}>
                      {proyecto.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-6 text-center">
                <label className="form-label d-block">Imagen Actual</label>
                {fotoExistente ? (
                  <img
                    src={`https://backendmern-pcor.onrender.com/media/permisos/${fotoExistente}`}
                    alt="Imagen actual"
                    className="img-thumbnail"
                    style={{ width: "120px", height: "120px", objectFit: "cover", borderRadius: "5px" }}
                  />
                ) : (
                  <p className="text-muted">No hay imagen disponible</p>
                )}
              </div>
            </div>

            <div className="mt-3">
              <label className="form-label">Nueva Imagen (opcional)</label>
              <input type="file" className="form-control" accept="image/*" onChange={handleImageChange} />
            </div>

            <div className="d-flex justify-content-center mt-4">
              <button type="submit" className="btn btn-primary px-4" disabled={subiendo}>
                {subiendo ? "Guardando..." : "Actualizar Permiso"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default EditarPermiso;
