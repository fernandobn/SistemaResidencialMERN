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
import { obtenerPermisos, eliminarPermiso } from "../services/permisoService";

const ListarPermisos = () => {
  const [permisos, setPermisos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // UseEffect para cargar permisos al iniciar el componente
  useEffect(() => {
    const fetchPermisos = async () => {
      try {
        const { success, data } = await obtenerPermisos();
        if (success && Array.isArray(data)) {
          setPermisos(data); // Asegúrate de que data es un array
        } else {
          iziToast.error({
            title: "Error",
            message: "No se pudieron cargar los permisos.",
            position: "topRight",
          });
        }
      } catch (error) {
        console.error("Error al obtener permisos:", error);
        iziToast.error({
          title: "Error",
          message: "No se pudieron cargar los permisos.",
          position: "topRight",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPermisos();
  }, []);

  // UseEffect para inicializar DataTable solo una vez
  useEffect(() => {
    if (!loading && permisos.length > 0) {
      if (!$.fn.DataTable.isDataTable("#tbl_permisos")) {
        $("#tbl_permisos").DataTable({
          dom: "Bfrtip",
          buttons: ["copyHtml5", "excelHtml5", "csvHtml5", "pdfHtml5"],
          language: {
            url: "https://cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json",
          },
        });
      }
    }
  }, [loading, permisos]);

  // Función para manejar la eliminación de un permiso
  const handleEliminar = async (id) => {
    try {
      iziToast.question({
        timeout: 20000,
        close: false,
        overlay: true,
        displayMode: "once",
        title: "Confirmación",
        message: "¿Estás seguro de eliminar este permiso?",
        position: "center",
        buttons: [
          [
            "<button><b>SÍ</b></button>",
            async function (instance, toast) {
              try {
                const { success } = await eliminarPermiso(id); // Usar _id para eliminar
                if (success) {
                  iziToast.success({
                    title: "Éxito",
                    message: "Permiso eliminado con éxito.",
                    position: "topRight",
                  });
                  setPermisos((prev) =>
                    prev.filter((permiso) => permiso._id !== id) // Filtrar por _id
                  );
                } else {
                  iziToast.error({
                    title: "Error",
                    message: "No se pudo eliminar el permiso.",
                    position: "topRight",
                  });
                }
              } catch (error) {
                console.error("🚨 Error al eliminar permiso:", error);
                iziToast.error({
                  title: "Error",
                  message: "No se pudo eliminar el permiso.",
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
    } catch (error) {
      console.error("Error al eliminar permiso:", error);
    }
  };

  // Si está cargando, mostrar el spinner
  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-3">Cargando permisos...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "100%", padding: "20px" }}>
      <h3 className="text-center mb-4">Listado de Permisos</h3>
      {permisos.length === 0 ? (
        <div className="alert alert-warning text-center">
          No hay permisos disponibles.
        </div>
      ) : (
        <div className="table-responsive">
          <table
            className="table table-striped table-bordered table-hover align-middle"
            id="tbl_permisos"
            style={{ fontSize: "1rem", width: "100%" }}
          >
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Tipo</th>
                <th>Número de Permiso</th>
                <th>Fecha de Emisión</th>
                <th>Fecha de Vencimiento</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {permisos.map((permiso) => (
                <tr key={permiso._id}>
                  <td>{permiso._id}</td>
                  <td>{permiso.tipo || "Sin tipo"}</td>
                  <td>{permiso.numero_permiso || "Sin número"}</td>
                  <td>
                    {permiso.fecha_emision
                      ? new Date(permiso.fecha_emision).toLocaleDateString()
                      : "No disponible"}
                  </td>
                  <td>
                    {permiso.fecha_vencimiento
                      ? new Date(permiso.fecha_vencimiento).toLocaleDateString()
                      : "No aplica"}
                  </td>
                  <td>
                    <button
                      className="btn btn-info btn-sm rounded-pill mb-2"
                      onClick={() =>
                        navigate(`/editarPermiso/${permiso._id}`)
                      }
                    >
                      ✏️ Editar
                    </button>
                    <button
                      className="btn btn-danger btn-sm rounded-pill mb-2"
                      onClick={() => handleEliminar(permiso._id)}
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

export default ListarPermisos;
