import React from "react";

const Home = () => {
  return (
    <div className="main-warp">
      {/* Hero Section */}
      <section id="hero" className="hero section dark-background">
        <img
          src="assets/assets/img/hero-bg.jpg"
          alt="Hero Background"
          data-aos="fade-in"
        />
        <div className="container d-flex flex-column align-items-center">
          <h2 data-aos="fade-up" data-aos-delay="100">
            PLANIFICA. LANZA. CRECE.
          </h2>
          <p data-aos="fade-up" data-aos-delay="200">
            Somos un equipo de expertos en desarrollo de proyectos residenciales.
          </p>
          <div className="d-flex mt-4" data-aos="fade-up" data-aos-delay="300">
            <a href="#about" className="btn-get-started">
              Comenzar
            </a>
            <a
              href="https://www.youtube.com/watch?v=Y7f98aduVJ8"
              className="glightbox btn-watch-video d-flex align-items-center"
            >
              <i className="bi bi-play-circle"></i>
              <span>Ver Video</span>
            </a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about section">
        <div className="container">
          <div className="row gy-4">
            <div className="col-lg-6" data-aos="fade-up" data-aos-delay="100">
              <h3>
                Desarrollamos proyectos residenciales innovadores y sostenibles
              </h3>
              <img
                src="assets/assets/img/about.jpg"
                className="img-fluid rounded-4 mb-4"
                alt="About"
              />
              <p>
                Nuestros proyectos están diseñados para ofrecer calidad de vida
                y sostenibilidad. Nos aseguramos de que cada detalle cumpla con
                los estándares más altos de construcción y diseño.
              </p>
              <p>
                Desde la planificación hasta la finalización, nuestro equipo
                trabaja con dedicación para entregar desarrollos modernos,
                eficientes y en armonía con el entorno.
              </p>
            </div>
            <div className="col-lg-6" data-aos="fade-up" data-aos-delay="250">
              <div className="content ps-0 ps-lg-5">
                <p className="fst-italic">
                  Nos especializamos en la gestión y ejecución de proyectos
                  residenciales de alta calidad, asegurando eficiencia y
                  satisfacción para nuestros clientes.
                </p>
                <ul>
                  <li>
                    <i className="bi bi-check-circle-fill"></i>
                    <span>Planificación estratégica y gestión de recursos.</span>
                  </li>
                  <li>
                    <i className="bi bi-check-circle-fill"></i>
                    <span>Diseño arquitectónico moderno y funcional.</span>
                  </li>
                  <li>
                    <i className="bi bi-check-circle-fill"></i>
                    <span>Compromiso con la sostenibilidad y la eficiencia energética.</span>
                  </li>
                </ul>
                <p>
                  Nuestro equipo está comprometido con la innovación y la
                  excelencia en cada proyecto, brindando soluciones personalizadas
                  y adaptadas a las necesidades del mercado inmobiliario.
                </p>

                <div className="position-relative mt-4">
                  <img
                    src="assets/assets/img/about-2.jpg"
                    className="img-fluid rounded-4"
                    alt="About 2"
                  />
                  <a
                    href="https://www.youtube.com/watch?v=Y7f98aduVJ8"
                    className="glightbox pulsating-play-btn"
                  ></a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
