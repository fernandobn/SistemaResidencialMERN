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
  const [fotoBase64, setFotoBase64] = useState(null);

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

    // Inicializar el fileinput con jQuery
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

    // Manejar cambio en la selección de archivo
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
  }, []);

  const onSubmit = async (data) => {
    setSubiendo(true);

    // Crear objeto con los datos
    const permisoData = {
      tipo: data.tipo,
      numero_permiso: data.numero_permiso,
      fecha_emision: data.fecha_emision,
      fecha_vencimiento: data.fecha_vencimiento || "",
      id_proyecto: data.id_proyecto,
      fotoBase64: fotoBase64, // Enviar imagen como Base64
    };

    console.log("🚀 Enviando datos al backend:", permisoData);

    try {
      const result = await guardarPermiso(permisoData);

      if (result.success) {
        iziToast.success({
          title: "Éxito",
          message: "Permiso guardado correctamente.",
          position: "topRight",
        });
        reset();
        $("#foto").fileinput("clear");
        setFotoBase64(null);
      } else {
        iziToast.error({
          title: "Error",
          message: result.message || "No se pudo guardar el permiso.",
          position: "topRight",
        });
      }
    } catch (error) {
      console.error("❌ Error al guardar el permiso:", error);
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
        <div className="card shadow-lg p-4" style={{ borderRadius: "12px", maxWidth: "900px", width: "100%" }}>
          <h3 className="text-center mb-4 text-primary">Registrar Permiso</h3>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Tipo de Permiso</label>
                <input type="text" className={`form-control ${errors.tipo ? "is-invalid" : ""}`} {...register("tipo", { required: "Ingrese el tipo de permiso." })} />
                {errors.tipo && <div className="invalid-feedback">{errors.tipo.message}</div>}
              </div>
              <div className="col-md-6">
                <label className="form-label">Número de Permiso</label>
                <input type="text" className={`form-control ${errors.numero_permiso ? "is-invalid" : ""}`} {...register("numero_permiso", { required: "Ingrese el número de permiso." })} />
                {errors.numero_permiso && <div className="invalid-feedback">{errors.numero_permiso.message}</div>}
              </div>
            </div>

            <div className="row g-3 mt-3">
              <div className="col-md-6">
                <label className="form-label">Fecha de Emisión</label>
                <input type="date" className={`form-control ${errors.fecha_emision ? "is-invalid" : ""}`} {...register("fecha_emision", { required: "Ingrese la fecha de emisión." })} />
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
                <select className="form-control" {...register("id_proyecto", { required: "Seleccione un proyecto." })}>
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
                <input id="foto" name="foto" type="file" accept="image/*" className="file" />
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
