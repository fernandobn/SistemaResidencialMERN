import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import { listarProyectos } from "../services/proyectoService"; // Function to list projects
import { guardarPermiso } from "../services/permisoService"; // Service function for saving permission
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
  const [proyectos, setProyectos] = useState([]); // State to store projects
  const [subiendo, setSubiendo] = useState(false);

  // Load projects on component mount
  useEffect(() => {
    listarProyectos()
      .then((data) => {
        setProyectos(data); // Save projects to state
      })
      .catch((error) => {
        console.error("Error loading projects:", error);
        iziToast.error({
          title: "Error",
          message: "No se pudieron cargar los proyectos.",
          position: "topRight",
        });
      });

    // Initialize fileinput for photo
    $("#foto").fileinput({
      language: "es", // Set language
      showUpload: false, // Hide upload button
      showRemove: false, // Hide remove button
      allowedFileExtensions: ["jpg", "jpeg", "png", "gif"], // Allowed file types
    });
  }, []);

  // Submit handler
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

    console.log("📤 Enviando datos al backend:", Object.fromEntries(formData));

    setSubiendo(true);
    try {
      const result = await guardarPermiso(formData);
      console.log("📝 Respuesta del backend:", result);

      if (result.success) {
        iziToast.success({
          title: "Éxito",
          message: "Permiso guardado correctamente.",
          position: "topRight",
        });
        reset();
      } else {
        iziToast.error({
          title: "Error",
          message: result.message || "No se pudo guardar el permiso.",
          position: "topRight",
        });
      }
    } catch (error) {
      console.error("🚨 Error saving permission:", error);
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
    <main className="main d-flex justify-content-center align-items-center vh-100">
      <div className="container-fluid">
        <div className="card shadow-lg p-4" style={{ width: "100%" }}>
          <h3 className="text-center mb-4 text-primary">Registrar Permiso</h3>

          <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Tipo de Permiso</label>
                <input
                  type="text"
                  name="tipo"
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
                  name="numero_permiso"
                  className={`form-control ${errors.numero_permiso ? "is-invalid" : ""}`}
                  placeholder="Ejemplo: 123456"
                  {...register("numero_permiso", { required: "Por favor ingrese el número de permiso." })}
                />
                {errors.numero_permiso && <div className="invalid-feedback">{errors.numero_permiso.message}</div>}
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Fecha de Emisión</label>
                <input
                  type="date"
                  name="fecha_emision"
                  className={`form-control ${errors.fecha_emision ? "is-invalid" : ""}`}
                  {...register("fecha_emision", { required: "Por favor ingrese la fecha de emisión." })}
                />
                {errors.fecha_emision && <div className="invalid-feedback">{errors.fecha_emision.message}</div>}
              </div>

              <div className="col-md-6">
                <label className="form-label">Fecha de Vencimiento</label>
                <input
                  type="date"
                  name="fecha_vencimiento"
                  className="form-control"
                  {...register("fecha_vencimiento")}
                />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-12">
                <label className="form-label">Proyecto</label>
                <select
                  className="form-control"
                  name="id_proyecto"
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
            </div>

            <div className="row mb-3">
              <div className="col-md-12 d-flex justify-content-end">
                <div className="form-group">
                  <label className="form-label">Foto</label>
                  <input
                    id="foto"
                    name="foto"
                    type="file"
                    accept="image/*"
                    className="form-control-file"
                    {...register("foto")}
                  />
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-center">
              <button type="submit" className="btn btn-primary" disabled={subiendo}>
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
