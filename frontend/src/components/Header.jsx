import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <>
      <main className="main">
        <header
          id="header"
          className="header d-flex align-items-center fixed-top"
          style={{ backgroundColor: "#39434c" }}  
        >
          <div className="container-fluid container-xl position-relative d-flex align-items-center">
            {/* Logo */}
            <Link to="/" className="logo d-flex align-items-center me-auto">
              <h1 className="sitename">ProyResidenciales</h1>
            </Link>

            {/* Menú de navegación */}
            <nav id="navmenu" className="navmenu">
              <ul>
                <li>
                  <Link to="/" className="active">
                    Inicio
                  </Link>
                </li>
                <li>
                  <Link to="/Ubicacion/">Ubicación</Link>
                </li>
                <li>
                  <Link to="/nuevoProyecto/">Proyecto</Link>
                </li>
                <li>
                  <Link to="/nuevoPresupuesto/">Presupuesto</Link>
                </li>
                <li>
                  <Link to="/nuevoPermiso/">Permiso</Link>
                </li>
                <li className="dropdown">
                  <a href="#">
                    <span>Listado</span>
                    <i className="bi bi-chevron-down toggle-dropdown"></i>
                  </a>
                  <ul>
                    <li>
                      <Link to="/listarUbicaciones/">Listado Ubicación</Link>
                    </li>
                    <li>
                      <Link to="/listarProyectos/">Listado Proyecto</Link>
                    </li>
                    <li>
                      <Link to="/listarPresupuestos/">Listado Presupuesto</Link>
                    </li>
                    <li>
                      <Link to="/listarPermisos/">Listado Permiso</Link>
                    </li>
                  </ul>
                </li>
              </ul>
              <i className="mobile-nav-toggle d-xl-none bi bi-list"></i>
            </nav>
          </div>
        </header>
      </main>
    </>
  );
};

export default Header;
