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

  // Función para obtener presupuestos
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

  // Ejecutar fetchPresupuestos al montar el componente
  useEffect(() => {
    fetchPresupuestos();
  }, []);

  // Inicializar DataTable cuando se cargan los presupuestos
  useEffect(() => {
    if (!loading && presupuestos.length > 0) {
      setTimeout(() => {
        if ($.fn.DataTable.isDataTable("#tbl_presupuestos")) {
          $("#tbl_presupuestos").DataTable().destroy();
        }
        $("#tbl_presupuestos").DataTable({
          dom: "Bfrtip",
          buttons: ["copyHtml5", "excelHtml5", "csvHtml5", "pdfHtml5"],
          language: {
            url: "https://cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json",
          },
        });
      }, 500);
    }
  }, [loading, presupuestos]);

  // Manejo de eliminación de presupuestos
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
                const { success } = await eliminarPresupuesto(id);
                if (success) {
                  iziToast.success({
                    title: "Éxito",
                    message: "Presupuesto eliminado con éxito.",
                    position: "topRight",
                  });
                  fetchPresupuestos(); // Actualizar la lista automáticamente
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

  // Mostrar spinner mientras carga
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
    <div className="main-warp">
      <div className="page-section contact-page">
        <div className="contact-warp">
          <div className="row justify-content-center">
            <div className="col-xl-10 col-lg-12 col-md-12 mx-auto">
              <h3 className="text-center mb-4">Listado de Presupuestos</h3>
              {presupuestos.length === 0 ? (
                <div className="alert alert-warning text-center">
                  No hay presupuestos disponibles.
                </div>
              ) : (
                <div className="table-responsive">
                  <table
                    className="table table-bordered table-hover align-middle"
                    id="tbl_presupuestos"
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
                          <td>
                            {new Date(presupuesto.fecha_aprobacion).toLocaleDateString()}
                          </td>
                          <td>
                            {presupuesto.id_proyecto
                              ? presupuesto.id_proyecto.nombre
                              : "No asignado"}
                          </td>
                          <td>
                            <div className="d-flex justify-content-center">
                              <button
                                className="btn btn-info btn-sm me-2"
                                onClick={() =>
                                  navigate(`/editarPresupuesto/${presupuesto._id}`)
                                }
                              >
                                ✏️ Editar
                              </button>
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => handleEliminar(presupuesto._id)}
                              >
                                🗑️ Eliminar
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListarPresupuestos;
