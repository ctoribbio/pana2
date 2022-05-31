<template>
  <!-- Navigation-->
  <nav
    class="navbar navbar-expand-lg navbar-light navbar-shrink fixed-top py-3"
    id="mainNav"
  >
    <div class="container px-4 px-lg-5">
      <a class="navbar-brand" href="#page-top">PANA</a>
      <button
        class="navbar-toggler navbar-toggler-right"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarResponsive"
        aria-controls="navbarResponsive"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarResponsive">
        <ul class="navbar-nav ms-auto my-2 my-lg-0">
          <li class="nav-item">
            <a class="nav-link" href="/login">Inicia Sesión</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/signup">Registrate</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
  <!-- Masthead-->
  <header class="masthead">
    <div class="container px-4 px-lg-5 h-100">
      <div
        class="
          row
          gx-4 gx-lg-5
          h-100
          align-items-center
          justify-content-center
          text-center
        "
      >
        <div class="col-lg-8 align-self-end">
          <h1 class="text-white font-weight-bold">
            Descubre que puede hacer PANA por tu negocio
          </h1>
          <hr class="divider" />
        </div>
        <div class="col-lg-8 align-self-baseline">
          <p class="text-white-75 mb-5">
            PANA o Plataforma de Ayuda a Nuevos Autonomos es el punto de reunion
            de empresarios emergentes, con una base de datos poblada de
            empresas, no caerás en la desinformación, abriendo tu negocio en el lugar mas apropiado.
          </p>
          <a class="btn btn-primary btn-xl" href="/signup">Registrate Ahora</a>
        </div>
      </div>
    </div>
  </header>
  <!-- Services-->
  <section class="page-section" id="services">
    <div class="container px-4 px-lg-5">
      <h2 class="text-center mt-0">A tu servicio</h2>
      <hr class="divider" />
      <div class="row gx-4 gx-lg-5">
        <div class="col-lg-3 col-md-6 text-center">
          <div class="mt-5">
            <div class="mb-2">
              <span class="material-symbols-outlined"> map </span>
            </div>
            <h3 class="h4 mb-2">Sistema de Mapas</h3>
            <p class="text-muted mb-0">
              Comprueba de un vistazo la zona de tu sede.
            </p>
          </div>
        </div>
        <div class="col-lg-3 col-md-6 text-center">
          <div class="mt-5">
            <div class="mb-2">
              <span class="material-symbols-outlined"> add </span>
            </div>
            <h3 class="h4 mb-2">Agrega tu empresa</h3>
            <p class="text-muted mb-0">
              Agrega a tu empresa de manera gratuita y evita la competencia
            </p>
          </div>
        </div>
        <div class="col-lg-3 col-md-6 text-center">
          <div class="mt-5">
            <div class="mb-2"><span class="material-symbols-outlined">
search
</span></div>
            <h3 class="h4 mb-2">Conoce la competencia</h3>
            <p class="text-muted mb-0">
              Conoce donde se situa tu competencia y sus datos.
            </p>
          </div>
        </div>
        <div class="col-lg-3 col-md-6 text-center">
          <div class="mt-5">
            <div class="mb-2"><span class="material-symbols-outlined">
sentiment_very_dissatisfied
</span></div>
            <h3 class="h4 mb-2">Evita Errores</h3>
            <p class="text-muted mb-0">
              No inicies tu aventura en una zona repleta de rivales.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
  <!-- Call to action-->
  <section class="page-section bg-dark text-white">
    <div class="container px-4 px-lg-5 text-center">
      <h2 class="mb-4">Registrate y da un paso adelante!</h2>
      <a class="btn btn-light btn-xl" href="/signup">Quiero unirme</a>
    </div>
  </section>
  <!-- Footer-->
  <footer class="bg-light py-5">
    <div class="container px-4 px-lg-5">
      <div class="small text-center text-muted">
        Copyright &copy; 2022 - PANA.- César Toribio DAW
      </div>
    </div>
  </footer>
</template>

<script>
import * as CSS from "../assets/styles/landing/styles.css";

import * as JS from "../assets/js/landing/scripts.js";

export default {
  name: "Home",
  mounted() {
    localStorage.clear();
    var tag = document.createElement("link");
    tag.rel = "stylesheet";
    tag.href =
      "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css";
    document.head.appendChild(tag);
    tag = document.createElement("link");
    tag.href =
      "https://fonts.googleapis.com/css?family=Merriweather+Sans:400,700";
    document.head.appendChild(tag);
    tag = document.createElement("link");
    tag.href =
      "https://fonts.googleapis.com/css?family=Merriweather:400,300,300italic,400italic,700,700italic";
    document.head.appendChild(tag);
    tag = document.createElement("link");
    tag.href =
      "https://cdnjs.cloudflare.com/ajax/libs/SimpleLightbox/2.1.0/simpleLightbox.min.css";
    document.head.appendChild(tag);
    tag = document.createElement("link");
     tag.setAttribute(
      "href",
      "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css"
    );
    document.head.appendChild(tag);

    tag = document.createElement("link");
    tag.setAttribute("rel", "stylesheet");
    tag.setAttribute(
      "href",
      "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,300,1,0"
    );
    document.head.appendChild(tag);

    tag = document.createElement("link");
    tag.href = CSS;
    document.head.appendChild(tag);

    tag = document.createElement("script");
    tag.setAttribute("src",
      "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js") ;
    document.body.appendChild(tag);
    tag = document.createElement("script");
    tag.setAttribute("src",
      "https://cdnjs.cloudflare.com/ajax/libs/SimpleLightbox/2.1.0/simpleLightbox.min.js");
    document.body.appendChild(tag);
    tag = document.createElement("script");
    tag.setAttribute("src", JS);
    document.body.appendChild(tag);
  },
};
</script>