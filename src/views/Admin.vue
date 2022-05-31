<template>
<h1>Panel de Administrador</h1>
  <div class="list">
    <h2>Users</h2>
    <table class="table table-striped w-75 center">
      <tr>
        <th class="left">Username</th>
        <th>DNI</th>
        <th>Telefono</th>
        <th>E-Mail</th>
        <th>Ha formalizado su empresa</th>
        <th></th>
      </tr>
      <tbody>
        <tr v-for="(user, index) in users" v-bind:key="index">
          <td class="left item">{{ user.username }}</td>
          <td class=" item">{{ user.dni }}</td>
          <td class=" item">{{ user.telf }}</td>
          <td class=" item">{{ user.email }}</td>
          <td class=" item"><span v-on:="colorAll()" v-bind:id ="user.username" class=" bool material-symbols-outlined">{{ this.getBool(user.bool) }}</span></td>
          <td class="right  botonb">
            <button
              class="btn btn-danger borrar "
              v-bind:id="index"
              @click="deleteUser($event)"
            >
              <span  v-bind:id="index" class="material-symbols-outlined">
delete
</span>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <h2>Companies</h2>
    <table class="table table-striped w-75 center">
      <tr>
        <th class="left">Nombre</th>
        <th>Sector</th>
        <th>Latitud</th>
        <th>Logitud</th>
        <th>Creador</th>
        <th></th>
      </tr>
      <tbody>
        <tr v-for="(company, index) in companies" v-bind:key="index">
          <td class="left">{{ company.name }}</td>
          <td>{{ company.sector }}</td>
          <td>{{ company.lat }}</td>
          <td>{{ company.lng }}</td>
          <td>{{ company.creator }}</td>
          <td class="right botonb">
            <button
              class="btn btn-danger borrar"
              v-bind:id="index"
              @click="deleteCompany($event)"
            >
              <span  v-bind:id="index" class="material-symbols-outlined">
delete
</span>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <a href="/login">Cerrar Sesion</a>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      users: new Array(),
      companies: new Array(),
    };
  },
  mounted() {
     if(localStorage.getItem("role")!="ROLE_ADMIN"){
       location.replace("/map");
     }
    var tag = document.createElement("link");
    tag.setAttribute("rel", "stylesheet");
    tag.setAttribute(
      "href",
      "https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css"
    );
    document.head.appendChild(tag)
    tag = document.createElement("link");
    tag.setAttribute("rel", "stylesheet");
    tag.setAttribute(
      "href",
      "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,300,1,0"
    );
    document.head.appendChild(tag);
    if (localStorage.getItem("token") == undefined) {
      location.replace("/login");
    }

    this.fillUsers();
    this.fillCompanies();
    
  },
  methods: {
    colorAll(){
      for(var i = 0; i < document.getElementsByClassName("bool").length; i++){
        if(document.getElementsByClassName("bool")[i].innerText == "close"){
          document.getElementsByClassName("bool")[i].style.color = "red";
        }else{
          document.getElementsByClassName("bool")[i].style.color = "green"
        }
      }
    },
    getBool(bool){
      if(bool){
        return "done"
      }else{
        return "close"
      }
    },
    fillUsers() {
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/ld+json");

      var requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      fetch("https://pana-api1.herokuapp.com/api/admins", requestOptions)
        .then((response) => response.text())
        .then((result) => {
          class Admin {
            constructor(iri, username, dni, telf, email, bool) {
              this.iri = iri;
              this.username = username;
              this.dni = dni;
              this.username = username;
              this.telf = telf;
              this.email = email;
              this.bool = bool;
            }
          }

          var json = JSON.parse(result)["hydra:member"];
          for (var i = 0; i < json.length; i++) {
            console.log("a");
            var a = new Admin(
              json[i]["@id"],
              json[i]["username"],
              json[i]["dni"],
              json[i]["telf"],
              json[i]["email"],
              json[i]["companyAdded"]
            );
            this.users.push(a);
          }
        })
        .catch((error) => console.log("error", error));
    },
    fillCompanies() {
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/ld+json");
      myHeaders.append(
        "Authorization",
        "Bearer " + localStorage.getItem("token")
      );

      var requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      fetch("https://pana-api1.herokuapp.com/api/companies", requestOptions)
        .then((response) => response.text())
        .then((result) => {
          class Company {
            constructor(iri, name, sector, lat, lng, creator) {
              this.iri = iri;
              this.name = name;
              this.sector = sector;
              this.lat = lat;
              this.lng = lng;
              this.creator = creator;
            }
          }
          var json = JSON.parse(result)["hydra:member"];
          for (var i = 0; i < json.length; i++) {
            var x;
            for (var j = 0; j < this.users.length; j++) {
              if (this.users[j].iri == json[i]["username"]) {
                x = this.users[j].username;
                break;
              }
            }
            var c = new Company(
              json[i]["@id"],
              json[i]["name"],
              json[i]["sector"],
              json[i]["lat"],
              json[i]["lng"],
              x
            );
            console.log(x);
            this.companies.push(c);
          }
        })
        .catch((error) => console.log("error", error));
    },
    deleteCompany(event) {
      if (confirm("Estas seguro de querer borrar esta compañia?")) {
        var iri = this.companies[event.target.id].iri;
        console.log(iri);
        var myHeaders = new Headers();
        myHeaders.append(
          "Authorization",
          "Bearer " + localStorage.getItem("token")
        );

        var requestOptions = {
          method: "DELETE",
          headers: myHeaders,
          redirect: "follow",
        };

        fetch("https://pana-api1.herokuapp.com" + iri, requestOptions)
          .then((response) => response.text())
          .then((result) => {
            console.log(result);
            location.reload();
          })
          .catch((error) => console.log("error", error));
      }
    },
    deleteUser(event) {
      if (confirm("Estas seguro de borrar este usuario?")) {
        var iri = this.users[event.target.id].iri;
        console.log(event.target.id)
        if(iri == localStorage.getItem("username")) {
          alert("No se puede eliminar el usuario administrador");
        }else{

        var myHeaders = new Headers();
        myHeaders.append(
          "Authorization",
          "Bearer" + localStorage.getItem("token")
        );

        var requestOptions = {
          method: "DELETE",
          headers: myHeaders,
          redirect: "follow",
        };

        fetch("https://pana-api1.herokuapp.com" + iri, requestOptions)
          .then((response) => response.text())
          .then((result) => {
            console.log(result);
            location.reload();
          })
          .catch((error) => console.log("error", error));
        }
      }
    },
  },
};
</script>