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
import { listarUbicaciones, eliminarUbicacion } from "../services/ubicacionService";

const ListarUbicaciones = () => {
  const [ubicaciones, setUbicaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUbicaciones = async () => {
      try {
        const data = await listarUbicaciones(); // Ajusta esto según tu API
        setUbicaciones(data);
      } catch (error) {
        console.error("Error al obtener ubicaciones:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUbicaciones();
  }, []);

  useEffect(() => {
    if (!loading && ubicaciones.length > 0) {
      if (!$.fn.DataTable.isDataTable("#tbl_ubicaciones")) {
        $("#tbl_ubicaciones").DataTable({
          dom: "Bfrtip",
          buttons: ["copyHtml5", "excelHtml5", "csvHtml5", "pdfHtml5"],
          language: {
            url: "https://cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json",
          },
        });
      }
    }
  }, [loading, ubicaciones]);

  const handleEliminar = (id) => {
    iziToast.question({
      timeout: 20000,
      close: false,
      overlay: true,
      displayMode: "once",
      title: "Confirmación",
      message: "¿Estás seguro de eliminar esta ubicación?",
      position: "center",
      buttons: [
        [
          "<button><b>SÍ</b></button>",
          async function (instance, toast) {
            try {
              await eliminarUbicacion(id);
              iziToast.success({
                title: "Éxito",
                message: "Ubicación eliminada con éxito.",
                position: "topRight",
              });
              setUbicaciones((prev) =>
                prev.filter((ubicacion) => ubicacion.id_ubicacion !== id)
              );
            } catch (error) {
              iziToast.error({
                title: "Error",
                message: "No se pudo eliminar la ubicación.",
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
        <p className="mt-3">Cargando ubicaciones...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "100%", padding: "20px" }}>
      <h3 className="text-center mb-4">Listado de Ubicaciones</h3>
      {ubicaciones.length === 0 ? (
        <div className="alert alert-warning text-center">
          No hay ubicaciones disponibles.
        </div>
      ) : (
        <div className="table-responsive">
          <table
            className="table table-striped table-bordered table-hover align-middle"
            id="tbl_ubicaciones"
            style={{ fontSize: "1rem", width: "100%" }}
          >
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Dirección</th>
                <th>Ciudad</th>
                <th>Estado</th>
                <th>Código Postal</th>
                <th>País</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ubicaciones.map((ubicacion) => (
                <tr key={ubicacion.id_ubicacion}>
                  <td>{ubicacion.id_ubicacion}</td>
                  <td>{ubicacion.direccion}</td>
                  <td>{ubicacion.ciudad}</td>
                  <td>{ubicacion.estado}</td>
                  <td>{ubicacion.codigo_postal}</td>
                  <td>{ubicacion.pais}</td>
                  <td>
                    <button
                      className="btn btn-info btn-sm rounded-pill mb-2"
                      onClick={() =>
                        navigate(`/editarUbicacion/${ubicacion.id_ubicacion}`)
                      }
                    >
                      ✏️ Editar
                    </button>
                    <button
                      className="btn btn-danger btn-sm rounded-pill mb-2"
                      onClick={() => handleEliminar(ubicacion.id_ubicacion)}
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

export default ListarUbicaciones;
