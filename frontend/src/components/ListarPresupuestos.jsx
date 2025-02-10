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
import { obtenerPresupuestos, eliminarPresupuesto } from "../services/presupuestoService";

const ListarPresupuestos = () => {
  const [presupuestos, setPresupuestos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // UseEffect para cargar presupuestos al iniciar el componente
  useEffect(() => {
    const fetchPresupuestos = async () => {
      try {
        const { success, data } = await obtenerPresupuestos();
        if (success) {
          setPresupuestos(data);
        } else {
          iziToast.error({
            title: "Error",
            message: "No se pudieron cargar los presupuestos.",
            position: "topRight",
          });
        }
      } catch (error) {
        console.error("Error al obtener presupuestos:", error);
        iziToast.error({
          title: "Error",
          message: "No se pudieron cargar los presupuestos.",
          position: "topRight",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPresupuestos();
  }, []);

  // UseEffect para inicializar DataTable solo una vez
  useEffect(() => {
    if (!loading && presupuestos.length > 0) {
      if (!$.fn.DataTable.isDataTable("#tbl_presupuestos")) {
        $("#tbl_presupuestos").DataTable({
          dom: "Bfrtip",
          buttons: ["copyHtml5", "excelHtml5", "csvHtml5", "pdfHtml5"],
          language: {
            url: "https://cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json",
          },
        });
      }
    }
  }, [loading, presupuestos]);

  // Función para manejar la eliminación de un presupuesto
  const handleEliminar = async (id) => {
    try {
      iziToast.question({
        timeout: 20000,
        close: false,
        overlay: true,
        displayMode: "once",
        title: "Confirmación",
        message: "¿Estás seguro de eliminar este presupuesto?",
        position: "center",
        buttons: [
          [
            "<button><b>SÍ</b></button>",
            async function (instance, toast) {
              try {
                const { success } = await eliminarPresupuesto(id); // Usar _id para eliminar
                if (success) {
                  iziToast.success({
                    title: "Éxito",
                    message: "Presupuesto eliminado con éxito.",
                    position: "topRight",
                  });
                  setPresupuestos((prev) =>
                    prev.filter((presupuesto) => presupuesto._id !== id) // Filtrar por _id
                  );
                } else {
                  iziToast.error({
                    title: "Error",
                    message: "No se pudo eliminar el presupuesto.",
                    position: "topRight",
                  });
                }
              } catch (error) {
                console.error("🚨 Error al eliminar presupuesto:", error);
                iziToast.error({
                  title: "Error",
                  message: "No se pudo eliminar el presupuesto.",
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
      console.error("Error al eliminar presupuesto:", error);
    }
  };

  // Si está cargando, mostrar el spinner
  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-3">Cargando presupuestos...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "100%", padding: "20px" }}>
      <h3 className="text-center mb-4">Listado de Presupuestos</h3>
      {presupuestos.length === 0 ? (
        <div className="alert alert-warning text-center">
          No hay presupuestos disponibles.
        </div>
      ) : (
        <div className="table-responsive">
          <table
            className="table table-striped table-bordered table-hover align-middle"
            id="tbl_presupuestos"
            style={{ fontSize: "1rem", width: "100%" }}
          >
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Monto Total</th>
                <th>Monto Utilizado</th>
                <th>Fecha de Aprobación</th>
                <th>Proyecto</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {presupuestos.map((presupuesto) => (
                <tr key={presupuesto._id}>
                  <td>{presupuesto._id}</td>
                  <td>{presupuesto.monto_total}</td>
                  <td>{presupuesto.monto_utilizado}</td>
                  <td>{new Date(presupuesto.fecha_aprobacion).toLocaleDateString()}</td>
                  <td>
                    {presupuesto.id_proyecto ? presupuesto.id_proyecto.nombre : "No asignado"}
                  </td>
                  <td>
                    <button
                      className="btn btn-info btn-sm rounded-pill mb-2"
                      onClick={() =>
                        navigate(`/editarPresupuesto/${presupuesto._id}`)
                      }
                    >
                      ✏️ Editar
                    </button>
                    <button
                      className="btn btn-danger btn-sm rounded-pill mb-2"
                      onClick={() => handleEliminar(presupuesto._id)}
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

export default ListarPresupuestos;
