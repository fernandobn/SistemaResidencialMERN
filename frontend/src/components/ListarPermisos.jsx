import React, { useEffect, useState } from "react";
import { obtenerPermisos, eliminarPermiso } from "../services/permisoService";
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

const ListarPermisos = () => {
  const [permisos, setPermisos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Función para obtener permisos (accesible desde cualquier parte)
  const fetchPermisos = async () => {
    try {
      const response = await obtenerPermisos();
      console.log("📡 Respuesta obtenida:", response);
  
      // ✅ Verificamos la estructura de la respuesta antes de actualizar el estado
      if (response.success) {
        if (Array.isArray(response.data)) {
          console.log("✅ Datos en 'data', actualizando estado...");
          setPermisos(response.data);
        } else if (response.data && Array.isArray(response.data.data)) {
          console.log("✅ Datos en 'data.data', corrigiendo y actualizando estado...");
          setPermisos(response.data.data);
        } else {
          console.error("⚠️ Error: La API no devolvió un array válido.", response);
          iziToast.error({
            title: "Error",
            message: "No se pudieron cargar los permisos.",
            position: "topRight",
          });
        }
      } else {
        console.error("⚠️ Error: La API devolvió 'success: false'.", response);
        iziToast.error({
          title: "Error",
          message: "No se pudieron cargar los permisos.",
          position: "topRight",
        });
      }
    } catch (error) {
      console.error("❌ Error al obtener permisos:", error);
      iziToast.error({
        title: "Error",
        message: "No se pudieron cargar los permisos.",
        position: "topRight",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Ejecutar fetchPermisos cuando se monta el componente
  useEffect(() => {
    fetchPermisos();
  }, []);

  // Inicializar DataTable cuando se cargan los permisos
  useEffect(() => {
    if (!loading && permisos.length > 0) {
      console.log("🔄 Inicializando DataTable con permisos:", permisos);
      setTimeout(() => {
        if ($.fn.DataTable.isDataTable("#tbl_permisos")) {
          $("#tbl_permisos").DataTable().destroy();
        }
        $("#tbl_permisos").DataTable({
          dom: "Bfrtip",
          buttons: ["copyHtml5", "excelHtml5", "csvHtml5", "pdfHtml5"],
          language: {
            url: "https://cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json",
          },
        });
      }, 500);
    }
  }, [loading, permisos]);

  // Manejo de eliminación de permisos
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
                const { success } = await eliminarPermiso(id);
                if (success) {
                  iziToast.success({
                    title: "Éxito",
                    message: "Permiso eliminado con éxito.",
                    position: "topRight",
                  });
                  // 🔄 Volver a obtener permisos automáticamente
                  fetchPermisos();
                } else {
                  iziToast.error({
                    title: "Error",
                    message: "No se pudo eliminar el permiso.",
                    position: "topRight",
                  });
                }
              } catch (error) {
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

  // Mostrar mensaje de carga mientras se obtienen los permisos
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
    <div className="main-warp">
      <div className="page-section contact-page">
        <div className="contact-warp">
          <div className="row justify-content-center">
            {/* Usamos col-xl-10 para centrar y ajustar el ancho */}
            <div className="col-xl-10 col-lg-12 col-md-12 mx-auto">
              <div className="contact-text">
                <span>Gestión de</span>
                <h2>Permisos</h2>
                {permisos.length > 0 ? (
                  <div className="table-responsive">
                    <table
                      className="table table-bordered table-hover align-middle"
                      id="tbl_permisos"
                    >
                      <thead className="table-dark">
                        <tr>
                          <th>ID</th>
                          <th>Vista Previa</th>
                          <th>Nombre del Proyecto</th>
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
                            <td>
                              {permiso.foto ? (
                                <img
                                  src={`http://localhost:5000/media/permisos/${permiso.foto}`}
                                  alt="Vista previa"
                                  className="img-thumbnail"
                                  style={{
                                    width: "60px",
                                    height: "60px",
                                    objectFit: "cover",
                                    borderRadius: "5px",
                                  }}
                                />
                              ) : (
                                <span className="text-muted">Sin imagen</span>
                              )}
                            </td>
                            <td>{permiso.id_proyecto?.nombre || "Sin Proyecto"}</td>
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
                              <div className="d-flex justify-content-center">
                                <button
                                  className="btn btn-info btn-sm me-2"
                                  onClick={() => navigate(`/editarPermiso/${permiso._id}`)}
                                >
                                  ✏️ Editar
                                </button>
                                <button
                                  className="btn btn-danger btn-sm"
                                  onClick={() => handleEliminar(permiso._id)}
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
                ) : (
                  <div className="alert alert-warning text-center">
                    No hay permisos disponibles.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
};

export default ListarPermisos;
