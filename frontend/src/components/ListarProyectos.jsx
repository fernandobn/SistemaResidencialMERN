import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import $ from "jquery";
import "datatables.net-dt";
import "datatables.net-buttons-dt";
import "jszip";
import "pdfmake/build/pdfmake";
import "pdfmake/build/vfs_fonts";
import "datatables.net-buttons/js/buttons.html5.js";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import { listarProyectos, eliminarProyecto } from "../services/proyectoService";

const ListarProyectos = () => {
  const [proyectos, setProyectos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProyectos = async () => {
      try {
        const data = await listarProyectos(); // Ajusta esto según tu API
        setProyectos(data);
      } catch (error) {
        console.error("Error al obtener proyectos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProyectos();
  }, []);

  useEffect(() => {
    if (!loading && proyectos.length > 0) {
      if (!$.fn.DataTable.isDataTable("#tbl_proyectos")) {
        $("#tbl_proyectos").DataTable({
          dom: "Bfrtip",
          buttons: ["copyHtml5", "excelHtml5", "csvHtml5", "pdfHtml5"],
          language: {
            url: "https://cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json",
          },
        });
      }
    }
  }, [loading, proyectos]);

  const handleEliminar = (id) => {
    iziToast.question({
      timeout: 20000,
      close: false,
      overlay: true,
      displayMode: "once",
      title: "Confirmación",
      message: "¿Estás seguro de eliminar este proyecto?",
      position: "center",
      buttons: [
        [
          "<button><b>SÍ</b></button>",
          async function (instance, toast) {
            try {
              await eliminarProyecto(id);
              iziToast.success({
                title: "Éxito",
                message: "Proyecto eliminado con éxito.",
                position: "topRight",
              });
              setProyectos((prev) =>
                prev.filter((proyecto) => proyecto.id_proyecto !== id)
              );
            } catch (error) {
              iziToast.error({
                title: "Error",
                message: "No se pudo eliminar el proyecto.",
                position: "topRight",
              });
            }
            instance.hide({ transitionOut: "fadeOut" }, toast, "button");
          },
          true,
        ],
        [
          "<button>NO</button>",
          function (instance, toast) {
            instance.hide({ transitionOut: "fadeOut" }, toast, "button");
          },
        ],
      ],
    });
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-3">Cargando proyectos...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "100%", padding: "20px" }}>
      <h3 className="text-center mb-4">Listado de Proyectos</h3>
      {proyectos.length === 0 ? (
        <div className="alert alert-warning text-center">
          No hay proyectos disponibles.
        </div>
      ) : (
        <div className="table-responsive">
          <table
            className="table table-striped table-bordered table-hover align-middle"
            id="tbl_proyectos"
            style={{ fontSize: "1rem", width: "100%" }}
          >
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Fecha de Inicio</th>
                <th>Fecha de Fin</th>
                <th>Ubicación</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {proyectos.map((proyecto) => (
                <tr key={proyecto.id_proyecto}>
                  <td>{proyecto.id_proyecto}</td>
                  <td>{proyecto.nombre}</td>
                  <td>{proyecto.descripcion}</td>
                  <td>{new Date(proyecto.fecha_inicio).toLocaleDateString()}</td>
                  <td>{new Date(proyecto.fecha_fin).toLocaleDateString()}</td>
                  <td>
                    {proyecto.id_ubicacion && proyecto.id_ubicacion.ciudad
                      ? `${proyecto.id_ubicacion.direccion}, ${proyecto.id_ubicacion.ciudad}, ${proyecto.id_ubicacion.estado}, ${proyecto.id_ubicacion.pais}`
                      : "Ubicación no disponible"}
                  </td>
                  <td>
                    <button
                      className="btn btn-info btn-sm rounded-pill mb-2"
                      onClick={() =>
                        navigate(`/editarProyecto/${proyecto.id_proyecto}`)
                      }
                    >
                      ✏️ Editar
                    </button>
                    <button
                      className="btn btn-danger btn-sm rounded-pill mb-2"
                      onClick={() => handleEliminar(proyecto.id_proyecto)}
                    >
                      🗑️ Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ListarProyectos;
