import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import { obtenerPermisoPorId, actualizarPermiso } from "../services/permisoService";
import { listarProyectos } from "../services/proyectoService";
import "bootstrap-fileinput/js/fileinput";
import "bootstrap-fileinput/js/locales/es";
import "bootstrap-fileinput/css/fileinput.min.css";
import $ from "jquery";

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
  const [fotoBase64, setFotoBase64] = useState(null);
  const [fotoExistente, setFotoExistente] = useState("");

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
          setValue("fotoExistente", permiso.foto || ""); // Setear la foto existente como hidden value

          setFotoExistente(permiso.foto || "");
        } else {
          throw new Error("Error al obtener los datos del permiso.");
        }
      })
      .catch(() =>
        iziToast.error({ title: "Error", message: "No se pudo cargar el permiso.", position: "topRight" })
      );

    $("#foto").fileinput({
      language: "es",
      showUpload: false,
      showRemove: true,
      browseClass: "btn btn-primary",
      allowedFileExtensions: ["jpg", "jpeg", "png", "gif"],
      dropZoneEnabled: true,
      maxFileSize: 2048,
      theme: "fas",
    });

    $("#foto").on("change", function (event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFotoBase64(reader.result);
        };
        reader.readAsDataURL(file);
      }
    });
  }, [permisoId, setValue]);

  const onSubmit = async (data) => {
    setSubiendo(true);
  
    const permisoData = {
      tipo: data.tipo,
      numero_permiso: data.numero_permiso,
      fecha_emision: data.fecha_emision,
      fecha_vencimiento: data.fecha_vencimiento || "",
      id_proyecto: data.id_proyecto,
      fotoBase64: fotoBase64 || null,
      fotoExistente: data.fotoExistente, // Si no se cambia la imagen, se mantiene la existente
    };
  
    console.log("🚀 Datos enviados al backend:", JSON.stringify(permisoData, null, 2));
  
    try {
      const response = await fetch(`http://localhost:5000/api/permisos/${permisoId}`, {
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
            <input type="hidden" {...register("fotoExistente")} /> {/* Campo oculto para la foto existente */}

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
              <div className="col-md-6">
                <label className="form-label">Foto</label>
                <input id="foto" name="foto" type="file" accept="image/*" className="file" />
              </div>
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
