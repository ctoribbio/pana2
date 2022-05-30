<template>
  <Nav />

  <div>
    <h3>Tus Empresas:</h3>
    <table class="table center table-striped w-50">
      <thead class="thead-light">
        <tr>
          <td class="left align-middle">Nombre</td>
          <td class="align-middle">Sector</td>
          <td class="align-middle">Direccion</td>
          <td class="right"></td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(company, index) in companies" v-bind:key="index">
          <td class="w-40 left align-middle">{{ company.name }}</td>
          <td class="w-40 center align-middle">{{ company.sector }}</td>
          <td class="w-40 right align-middle">{{ company.direccion }}</td>
          <td class="right w-20xº">
            <button
              v-bind:id="index"
              class="btn btn-secondary"
              @click="deleteCompany($event)"
            >
              Borrar
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import Nav from "../components/Nav.vue";
export default {
  name: "Profile",
  components: {
    Nav,
  },
  data() {
    return {
      companies: new Array(),
      user: new Object(),
    };
  },
  created() {
    if (localStorage.getItem("token") == undefined) {
      location.replace("/login");
    }

    this.fillCompanies();
    this.fetchData();
  },
  mounted() {
    var tag = document.createElement("link");
    tag.setAttribute("rel", "stylesheet");
    tag.setAttribute(
      "href",
      "https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css"
    );
    document.head.appendChild(tag);

    tag = document.createElement("link");
    tag.setAttribute("rel", "stylesheet");
    tag.setAttribute(
      "href",
      "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,300,1,0"
    );
    document.head.appendChild(tag);
  },

  methods: {
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

      fetch("http://localhost:8000/api/companies", requestOptions)
        .then((response) => response.text())
        .then((result) => {
          class Company {
            constructor(iri, name, sector, lat, lng, creator, direccion) {
              this.iri = iri;
              this.name = name;
              this.sector = sector;
              this.lat = lat;
              this.lng = lng;
              this.creator = creator;
              this.direccion = direccion;
            }
          }
          var json = JSON.parse(result)["hydra:member"];
          for (var i = 0; i < json.length; i++) {
            if (json[i]["fullAddress"].length < 50) {
              var c = new Company(
                json[i]["@id"],
                json[i]["name"],
                json[i]["sector"],
                json[i]["lat"],
                json[i]["lng"],
                json[i]["username"],
                json[i]["fullAddress"]
              );
            } else {
              c = new Company(
                json[i]["@id"],
                json[i]["name"],
                json[i]["sector"],
                json[i]["lat"],
                json[i]["lng"],
                json[i]["username"],
                json[i]["fullAddress"].slice(0, 60)
              );
            }
            if (c.creator == localStorage.getItem("username")) {
              this.companies.push(c);
            }
          }
        })
        .catch((error) => console.log("error", error));
    },
    deleteCompany(event) {
      if (confirm("Estas seguro de que quieres borrar esta compañia?")) {
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

        fetch("http://localhost:8000" + iri, requestOptions)
          .then((response) => response.text())
          .then((result) => {
            console.log(result);
            location.reload();
          })
          .catch((error) => console.log("error", error));
      }
    },
    fetchData() {
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

      fetch(
        "http://localhost:8000" + localStorage.getItem("username"),
        requestOptions
      )
        .then((response) => response.text())
        .then((result) => {
          class User {
            constructor(username, dni, telf, email) {
              this.username = username;
              this.dni = dni;
              this.telf = telf;
              this.email = email;
            }
          }

          var json = JSON.parse(result);
          console.log(result);
          this.user = new User(
            json["username"],
            json["dni"],
            json["telf"],
            json["email"]
          );
        });
    },
  },
};
</script>