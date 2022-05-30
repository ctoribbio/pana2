<template>
    
    <div class="container-fluid ps-md-0">
  <div class="row g-0">
    <div class="d-none d-md-flex col-md-4 col-lg-6 bg-image"></div>
    <div class="col-md-8 col-lg-6">
      <div class="login d-flex align-items-center py-5">
        <div class="container">
          <div class="row">
            <div class="col-md-9 col-lg-8 mx-auto">
              <h3 @load="load()" class="login-heading mb-4">Bienvenido</h3>
                <h4 id="error"></h4>
              <!-- Sign In Form -->
              <form id="form">
                <div class="form-floating mb-3">
                  <input type="text" class="form-control" id="username" placeholder="Nombre de Usuario">
                  <label for="username">Nombre de Usuario</label>
                </div>
                <div class="form-floating mb-3">
                  <input type="password" class="form-control" id="password" placeholder="Password">
                  <label for="password">Contraseña</label>
                </div>
                <input type="hidden" id="type" value="login" />
                <div class="d-grid">
                  <button class="btn btn-lg btn-primary btn-login text-uppercase fw-bold mb-2"  @click="login()" type="submit">Iniciar Sesión</button>
                  <div class="text-center">
                    <a class="small" href="/signup">No tienes cuenta? Regístrate</a><br>
                    <a class="small" href="/">Volver</a>
                  </div>
                </div>

              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>
<script>
import * as CSS from "../assets/styles/login/styles.css"
export default {
  name: "Login",
  created() {
    localStorage.clear();
    var tag = document.createElement("link");
    tag.rel = "stylesheet"
    tag.setAttribute("href",CSS);

    tag = document.createElement("link");
    tag.rel = "stylesheet"
    tag.setAttribute("href","https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css");

    tag = document.createElement("link");
    tag.rel = "stylesheet"
    tag.setAttribute("href","https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.bundle.min.js");
  },
  data() {
    return {};
  },
  methods: {
    login() {
      document.forms[0].addEventListener("submit", (e) => {
        e.preventDefault();
      });
      var username = document.getElementById("username").value.trim();
      var password = document.getElementById("password").value.trim();

      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var raw = JSON.stringify({
        username: username,
        password: password,
      });

      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      var failure = {
        value: false,
        toString() {
          return this.value;
        },
        setValue(val) {
          this.value = val;
        },
      };

      fetch("http://localhost:8000/api/login_check", requestOptions)
        .then((response) => response.text())
        .then((result) => {
          if (JSON.parse(result)["token"] != undefined) {
            this.getRole(username);
            localStorage.setItem("token", JSON.parse(result)["token"]);
            localStorage.setItem("username", this.getIri(username));
          } else {
            document.getElementById("error").innerText =
              "Usuario o contraseña incorrectas";
            failure.setValue(true);
          }
          if (failure != true) {
            setTimeout(function () {
              if (localStorage.getItem("role") == "ROLE_USER") {
                location.replace("http://127.0.0.1:8080/map");
              } else {
                location.replace("http://127.0.0.1:8080/admin");
              }
            }, 1000);
          }
        })

        .catch(() => failure.setValue(true));
    },
    inputIri(data) {
      return JSON.parse(data)["hydra:member"][0]["@id"];
    },
    getRole(username) {
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/ld+json");

      var requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      fetch(
        "http://localhost:8000/api/admins?username=" + username,
        requestOptions
      )
        .then((response) => response.text())
        .then((result) => {
          var json = JSON.parse(result);
          if (json["hydra:member"][0] != undefined) {
            localStorage.setItem("role", json["hydra:member"][0]["roles"][0]);
          }
        })
        .catch((error) => console.log("error", error));
    },
    getIri(username) {
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/ld+json");

      var requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      fetch(
        "http://localhost:8000/api/admins?username=" + username,
        requestOptions
      )
        .then((response) => response.text())
        .then((result) => {
          var data = this.inputIri(result);
          localStorage.setItem("username", data);
        })
        .catch((error) => console.log("error", error));
    },
  },
};
</script>
