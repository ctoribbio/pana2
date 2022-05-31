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
                <h4><span class="error">{{ this.error }}</span></h4>
                <!-- Sign In Form -->
                <form id="form">
                  <div class="form-floating mb-3">
                    <input
                      type="text"
                      class="form-control"
                      id="username"
                      placeholder="Nombre de Usuario"
                    />
                    <label for="username">Nombre de usuario</label>
                  </div>
                  <div class="form-floating mb-3">
                    <input
                      type="password"
                      class="form-control"
                      id="password"
                      placeholder="Introduce la contraseña"
                    />
                    <label for="password">Introduce la contraseña</label>
                  </div>
                  <div class="form-floating mb-3">
                    <input
                      type="password"
                      class="form-control"
                      id="password2"
                      placeholder="Repite la contraseña"
                    />
                    <label for="password">Repite la contraseña</label>
                  </div>
                  <div class="form-floating mb-3">
                    <input
                      type="email"
                      class="form-control"
                      placeholder="Email"
                      id="email"
                    /><label for="email">Introduce tu email</label>
                  </div>
                  <div class="form-floating mb-3">
                    <input
                      type="text"
                      class="form-control"
                      placeholder="DNI"
                      id="dni"
                    /><label for="dni">Introduce tu DNI</label>
                  </div>
                  <div class="form-floating mb-3">
                    <input
                      type="text"
                      class="form-control"
                      placeholder="Telefono"
                      id="telefono"
                    /><label for="telefono">Introduce tu Numero de teléfono</label>
                  </div>
                  <input type="hidden" id="type" value="signup" />
                  <div class="d-grid">
                    <button
                      class="
                        btn btn-lg btn-primary btn-login
                        text-uppercase
                        fw-bold
                        mb-2
                      "
                      @click="signUp()"
                      type="submit"
                    >
                      Registrate
                    </button>
                    <div class="text-center">
                      <a class="small" href="/login"
                        >Ya tienes cuenta? Inicia Sesión</a
                      ><br>
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
  name: "Signup",
  mounted(){
    var tag = document.createElement("link");
    tag.rel = "stylesheet"
    tag.setAttribute("href",CSS);

    tag = document.createElement("link");
    tag.rel = "stylesheet"
    tag.setAttribute("href","https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css");

    tag = document.createElement("script");
    tag.setAttribute("src","https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.bundle.min.js");
  },
  data() {
    return {
      error: null,
    };
  },
  methods: {
    validate(username, password, password2, dni, telefono) {
      
      if (
        !this.checkName(username)||
        !this.nif(dni) ||
        !this.passwordV(password, password2) ||
        !this.telefonoV(telefono) ||
        !this.usernameV(username)
      ) {
        return false;
      } else {
        return true;
      }
    },
    usernameV(username) {
      if (username == "") {
        this.error = "El nombre de usuario no puede estar vacío";
        return false;
      } else if (username.length < 5) {
        this.error =
          "El nombre de usuario no puede tener menos de 5 caracteres";
        return false;
      } else if (username.length > 16) {
        this.error = "El nombre de usuario no puede superar los 16 caracteres";
        return false;
      } else {
        this.error = null;
        return true;
      }
    },
    telefonoV(telefono) {
      telefono = telefono.replace(/ /g, "");
      if (telefono.length != 9) {
        this.error = "Introduce un numero de telefono valido";
        return false;
      } else {
        return true;
      }
    },
    passwordV(password, password2) {
      if (password == "") {
        this.error = "La contraseña no puede estar vacía";
        return false;
      } else if (password.length < 8) {
        this.error = "La contraseña no puede contener menos de 8 caracteres";
        return false;
      } else if (password != password2) {
        this.error = "Ambas contraseñas no coinciden";
        return false;
      } else {
        return true;
      }
    },
    nif(dni) {
      var numero;
      var letr;
      var letra;
      var expresion_regular_dni;

      expresion_regular_dni = /^\d{8}[a-zA-Z]$/;

      if (expresion_regular_dni.test(dni) == true) {
        numero = dni.substr(0, dni.length - 1);
        letr = dni.substr(dni.length - 1, 1);
        numero = numero % 23;
        letra = "TRWAGMYFPDXBNJZSQVHLCKET";
        letra = letra.substring(numero, numero + 1);
        if (letra != letr.toUpperCase()) {
          this.error = "Dni erroneo";
          return false;
        } else {
          return true;
        }
      } else {
        this.error = "Dni erroneo";
        return false;
      }
    },
    async checkName(username) {
      var requestOptions = {
        method: "GET",
        redirect: "follow",
      };
      
      var bandera = await fetch("https://pana-api1.herokuapp.com/api/admins?username=" + username,
        requestOptions
      )
        .then((response) => response.text())
        .then((result) => {
          if (!JSON.parse(result)["hydra:member"].length == 0) {
              this.error = "Ya existe un usuario con ese nombre";
              bandera = true
          } else {
            bandera = false
            
          }
        })
        .catch((error) => console.log("error", error));

        return bandera;
    },

    signUp() {
      document.getElementById("form").addEventListener("submit", (e) => {
        e.preventDefault();
      });
      var username = document.getElementById("username").value.trim();
      var password = document.getElementById("password").value.trim();

      var password2 = document.getElementById("password2").value.trim();
      var dni = document.getElementById("dni").value.trim();
      //console.log(DNI)
      var telefono = document.getElementById("telefono").value.trim();
      var email = document.getElementById("email").value.trim();

      if (
        this.validate(username, password, password2, dni, telefono, email) ==
        true
      ) {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
          username: username,
          password: password,
          dni: dni,
          telf: telefono,
          email: email,
        });

        var requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: raw,
          redirect: "follow",
        };

        fetch("https://pana-api1.herokuapp.com/api/admins/register", requestOptions)
          .then((response) => response.text())
          .then((result) => {
            try{
             var b = result.replace(/'/g, '"');
              JSON.parse(b)
              alert("Bienvenido! Inicie Sesion!");
              setTimeout(() =>
              location.replace("/login"),2000)
            }catch(e){
              console.log(".")
            }
          })
          .catch((error) => console.log("error", error));
      }
    },
  },
};
</script>
