import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import { listarProyectos } from "../services/proyectoService";
import { guardarPermiso } from "../services/permisoService";
import "bootstrap-fileinput/js/fileinput";
import "bootstrap-fileinput/js/locales/es";
import "bootstrap-fileinput/css/fileinput.min.css";
import $ from "jquery";

const NuevoPermiso = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [proyectos, setProyectos] = useState([]);
  const [subiendo, setSubiendo] = useState(false);

  useEffect(() => {
    listarProyectos()
      .then((data) => setProyectos(data))
      .catch((error) => {
        console.error("Error al cargar los proyectos:", error);
        iziToast.error({
          title: "Error",
          message: "No se pudieron cargar los proyectos.",
          position: "topRight",
        });
      });

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
  }, []);

  const onSubmit = async (data) => {
    const formData = new FormData();

    if (data.foto && data.foto[0]) {
      formData.append("foto", data.foto[0]);
    }

    formData.append("tipo", data.tipo);
    formData.append("numero_permiso", data.numero_permiso);
    formData.append("fecha_emision", data.fecha_emision);
    formData.append("fecha_vencimiento", data.fecha_vencimiento || "");
    formData.append("id_proyecto", data.id_proyecto);

    setSubiendo(true);
    try {
      const result = await guardarPermiso(formData);

      if (result.success) {
        iziToast.success({
          title: "Éxito",
          message: "Permiso guardado correctamente.",
          position: "topRight",
        });
        reset();
        $("#foto").fileinput("clear");
      } else {
        iziToast.error({
          title: "Error",
          message: result.message || "No se pudo guardar el permiso.",
          position: "topRight",
        });
      }
    } catch (error) {
      console.error("Error al guardar el permiso:", error);
      iziToast.error({
        title: "Error",
        message: "No se pudo guardar el permiso. Verifique la consola para más detalles.",
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
          <h3 className="text-center mb-4 text-primary">Registrar Permiso</h3>
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
                <input
                  type="date"
                  className="form-control"
                  {...register("fecha_vencimiento")}
                />
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
                {errors.id_proyecto && <div className="invalid-feedback">{errors.id_proyecto.message}</div>}
              </div>
              <div className="col-md-6">
                <label className="form-label">Foto</label>
                <input
                  id="foto"
                  name="foto"
                  type="file"
                  accept="image/*"
                  className="file"
                  {...register("foto")}
                />
              </div>
            </div>

            <div className="d-flex justify-content-center mt-4">
              <button type="submit" className="btn btn-primary px-4" disabled={subiendo}>
                {subiendo ? "Guardando..." : "Guardar Permiso"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default NuevoPermiso;
