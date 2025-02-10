import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer id="footer" className="footer dark-background" style={{ width: "100%" }}>
      <div className="container footer-top">
        <div className="row gy-4">
          {/* Columna de información */}
          <div className="col-lg-4 col-md-6 footer-about">
            <Link to="/" className="logo d-flex align-items-center">
              <span className="sitename">ProyResidenciales</span>
            </Link>
            <div className="footer-contact pt-3">
              <p>Ecuador, Cotopaxi</p>
              <p>San Felipe Universidad Técnica de Cotopaxi</p>
              <p className="mt-3">
                <strong>Phone:</strong> <span>+1 5589 55488 55</span>
              </p>
              <p>
                <strong>Email:</strong> <span>info@example.com</span>
              </p>
            </div>
            <div className="social-links d-flex mt-4">
              <a href="">
                <i className="bi bi-twitter-x"></i>
              </a>
              <a href="">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="">
                <i className="bi bi-linkedin"></i>
              </a>
            </div>
          </div>

          {/* Columna de enlaces útiles */}
          <div className="col-lg-2 col-md-3 footer-links">
            <h4>Enlaces Útiles</h4>
            <ul>
              <li>
                <i className="bi bi-chevron-right"></i>{" "}
                <Link to="#">Inicio</Link>
              </li>
              <li>
                <i className="bi bi-chevron-right"></i>{" "}
                <Link to="#">Sobre Nosotros</Link>
              </li>
              <li>
                <i className="bi bi-chevron-right"></i>{" "}
                <Link to="#">Servicios</Link>
              </li>
              <li>
                <i className="bi bi-chevron-right"></i>{" "}
                <Link to="#">Términos del Servicio</Link>
              </li>
              <li>
                <i className="bi bi-chevron-right"></i>{" "}
                <Link to="#">Política de Privacidad</Link>
              </li>
            </ul>
          </div>

          {/* Columna de nuestros servicios */}
          <div className="col-lg-2 col-md-3 footer-links">
            <h4>Nuestros Servicios</h4>
            <ul>
              <li>
                <i className="bi bi-chevron-right"></i>{" "}
                <Link to="#">Diseño Web</Link>
              </li>
              <li>
                <i className="bi bi-chevron-right"></i>{" "}
                <Link to="#">Desarrollo Web</Link>
              </li>
              <li>
                <i className="bi bi-chevron-right"></i>{" "}
                <Link to="#">Gestión de Productos</Link>
              </li>
              <li>
                <i className="bi bi-chevron-right"></i>{" "}
                <Link to="#">Marketing</Link>
              </li>
              <li>
                <i className="bi bi-chevron-right"></i>{" "}
                <Link to="#">Diseño Gráfico</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Pie de página */}
      <div className="container-fluid copyright text-center mt-4" style={{ width: "100%", padding: "20px 0" }}>
        <p>
          © <span>Copyright</span> <strong className="px-1 sitename">Dewi</strong>{" "}
          <span>Todos los derechos reservados</span>
        </p>
        <div className="credits">
          Diseñado por <a href="">Henrry Barrionuevo</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
