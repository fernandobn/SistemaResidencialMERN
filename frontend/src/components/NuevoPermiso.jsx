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
    reset
  } = useForm();
  const [proyectos, setProyectos] = useState([]);  // State to store projects
  const [subiendo, setSubiendo] = useState(false);

  // Load projects on component mount
  useEffect(() => {
    listarProyectos()
      .then((data) => {
        setProyectos(data);  // Save projects to state
      })
      .catch((error) => {
        console.error("Error loading projects:", error);
        iziToast.error({
          title: "Error",
          message: "Unable to load projects.",
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
          title: "Success",
          message: "Permission saved successfully.",
          position: "topRight",
        });
        reset();
      } else {
        iziToast.error({
          title: "Error",
          message: result.message || "Failed to save the permission.",
          position: "topRight",
        });
      }
    } catch (error) {
      console.error("🚨 Error saving permission:", error);
      iziToast.error({
        title: "Error",
        message: "Failed to save the permission. Please check the console for more details.",
        position: "topRight",
      });
    } finally {
      setSubiendo(false);
    }
  };

  return (
    <main className="main d-flex justify-content-center align-items-center vh-100">
      <div className="container">
        <div className="card shadow-lg p-4">
          <h3 className="text-center mb-4 text-primary">Register Permission</h3>

          <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
            {/* Permission Type */}
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Permission Type</label>
                <input
                  type="text"
                  name="tipo"
                  className={`form-control ${errors.tipo ? "is-invalid" : ""}`}
                  placeholder="E.g. Construction"
                  {...register("tipo", { required: "Please enter the permission type." })}
                />
                {errors.tipo && <div className="invalid-feedback">{errors.tipo.message}</div>}
              </div>

              {/* Permission Number */}
              <div className="col-md-6">
                <label className="form-label">Permission Number</label>
                <input
                  type="text"
                  name="numero_permiso"
                  className={`form-control ${errors.numero_permiso ? "is-invalid" : ""}`}
                  placeholder="E.g. 123456"
                  {...register("numero_permiso", { required: "Please enter the permission number." })}
                />
                {errors.numero_permiso && <div className="invalid-feedback">{errors.numero_permiso.message}</div>}
              </div>
            </div>

            <div className="row mb-3">
              {/* Issue Date */}
              <div className="col-md-6">
                <label className="form-label">Issue Date</label>
                <input
                  type="date"
                  name="fecha_emision"
                  className={`form-control ${errors.fecha_emision ? "is-invalid" : ""}`}
                  {...register("fecha_emision", { required: "Please enter the issue date." })}
                />
                {errors.fecha_emision && <div className="invalid-feedback">{errors.fecha_emision.message}</div>}
              </div>

              {/* Expiration Date */}
              <div className="col-md-6">
                <label className="form-label">Expiration Date</label>
                <input
                  type="date"
                  name="fecha_vencimiento"
                  className="form-control"
                  {...register("fecha_vencimiento")}
                />
              </div>
            </div>

            <div className="row mb-3">
              {/* Project */}
              <div className="col-md-12">
                <label className="form-label">Project</label>
                <select
                  className="form-control"
                  name="id_proyecto"
                  {...register("id_proyecto", { required: "Please select a project." })}
                >
                  <option value="">Select a project</option>
                  {proyectos.map((proyecto) => (
                    <option key={proyecto._id} value={proyecto._id}>
                      {proyecto.nombre}
                    </option>
                  ))}
                </select>
                {errors.id_proyecto && <div className="invalid-feedback">{errors.id_proyecto.message}</div>}
              </div>
            </div>

            {/* Photo */}
            <div className="row mb-3">
              <div className="col-md-12">
                <label className="form-label">Photo</label>
                <input
                  id="foto"
                  name="foto"
                  type="file"
                  accept="image/*"
                  {...register("foto")}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" disabled={subiendo}>
              {subiendo ? "Saving..." : "Save Permission"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default NuevoPermiso;
