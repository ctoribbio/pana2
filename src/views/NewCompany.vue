<template>
  <Nav />
  <div class="map" id="map">
    <l-map
      v-if="showMap"
      :zoom="zoom"
      :center="center"
      :maxZoom="maxZoom"
      :options="mapOptions"
      @update:center="centerUpdate"
      @update:zoom="zoomUpdate"
    >
      <l-control position="topright" class="control">
        <form id="form">
          <input
            type="text"
            placeholder="Nombre de la Compañia"
            id="name"
            class="textbox"
          />
          <input type="text" placeholder="Sector" id="sector" class="textbox" />
          <Search />

          <input type="submit" class="boton" value="Añade tu empresa" @click="send()" />
          <input type="hidden" id="type" value="signup" />
        </form>
      </l-control>
      <l-tile-layer :url="url" :attribution="attribution" />
      <l-marker
        v-for="(marker, index) in markers"
        v-bind:key="index"
        :lat-lng="markerLatLng(marker)"
      >
        <l-popup ref="popup">
          <div>
            Nombre:<b>{{ this.getName(index) }}</b
            ><br />
            Sector:<b>{{ this.getSector(index) }}</b
            ><br />
            Direccion Completa:<b>{{ this.getAddress(index) }}</b
            ><br />
          </div>
        </l-popup>
      </l-marker>
    </l-map>
  </div>
</template>
<script>
import Nav from "../components/Nav.vue";
import {
  LMap,
  LTileLayer,
  LMarker,
  LPopup,
  LControl,
} from "@vue-leaflet/vue-leaflet";
import Search from "../components/Search.vue";
import { latLng } from "leaflet";
import * as CSS from "../assets/styles/styles.css";

export default {
  name: "NewCompany",
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPopup,
    LControl,
    Search,

    Nav,
  },

  data() {
    return {
      fetch: this.fetchCompanies(localStorage.getItem("token")),
      maxZoom: 19,
      zoom: 13,
      center: latLng(41.6529, -4.72839),
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      withPopup: latLng(41.6529, -4.72839),
      withTooltip: latLng(41.6529, -4.72839),
      currentZoom: 11.5,
      currentCenter: latLng(41.6529, -4.72839),
      showParagraph: false,
      mapOptions: {
        zoomSnap: 0.5,
      },
      showMap: true,
      markers: new Array(),
      nameArray: new Array(),
      sectorArray: new Array(),
      addressArray: new Array(),
      i: 0,
      lat: 0,
      lng: 0,
      direccionCompleta: "",
    };
  },
  mounted() {
    var tag = document.createElement("link");
    tag.setAttribute("rel", "stylesheet");
    tag.setAttribute(
      "href",
      "https://unpkg.com/leaflet@1.8.0/dist/leaflet.css"
    );
    document.head.appendChild(tag);

    tag = document.createElement("link");
    tag.setAttribute("rel", "stylesheet");
    tag.setAttribute("href", CSS);
    document.head.appendChild(tag);

    tag = document.createElement("script");
    tag.setAttribute(
      "src",
      "https://cdn.jsdelivr.net/gh/tomik23/autocomplete@1.8.3/dist/js/autocomplete.min.js"
    );
    document.head.appendChild(tag);

    tag = document.createElement("link");
    tag.setAttribute("rel", "stylesheet");
    tag.setAttribute(
      "href",
      "https://unpkg.com/bootstrap/dist/css/bootstrap.min.css"
    );
    document.head.appendChild(tag);

    tag = document.createElement("link");
    tag.setAttribute("rel", "stylesheet");
    tag.setAttribute(
      "href",
      "https://unpkg.com/bootstrap-vue@latest/dist/bootstrap-vue.min.css"
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
    async onLeafletReady() {
      await this.$nextTick();
      this.leafletObject = this.$refs.map.leafletObject;
      this.leafletReady = true;
    },
    fetchCompanies(token) {
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/Id+json");
      myHeaders.append("Authorization", "Bearer " + token);

      var requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      fetch("http://localhost:8000/api/companies", requestOptions)
        .then((response) => response.text())
        .then((result) => this.getCompanies(JSON.parse(result)))
        .catch((error) => console.log("error", error));
    },
    getCompanies(json) {
      if (json["hydra:member"] != undefined) {
        var index = json["hydra:member"].length;

        for (var i = 0; i < index; i++) {
          this.sectorArray.push(json["hydra:member"][i]["sector"]);
          this.nameArray.push(json["hydra:member"][i]["name"]);
          this.addressArray.push(json["hydra:member"][i]["fullAddress"]);
          var item = new Array();
          item.push(json["hydra:member"][i]["lat"]);
          item.push(json["hydra:member"][i]["lng"]);
          this.markers.push(item);
        }
      } else if (json["code"] != undefined && json["code"] == 401) {
        setTimeout(function () {
          location.replace("http://127.0.0.1:8080/login");
        }, 1000);
      }
    },
    markerLatLng(lat, lng) {
      return latLng(lat, lng);
    },
    send() {
      console.log(this.lat);
      console.log(this.lng);

      document.forms[0].addEventListener("submit", (e) => {
        e.preventDefault();
      });
      var name = document.getElementById("name").value.trim();

      var sector = document.getElementById("sector").value.trim();

      if (name == "" || sector == "" || this.lat == 0 || this.lng == 0) {
        alert("Rellena todos los campos del formulario");
      } else {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append(
          "Authorization",
          "Bearer " + localStorage.getItem("token")
        );

        var raw = JSON.stringify({
          name: name,
          fullAddress: this.direccionCompleta,
          sector: sector,
          lat: this.lat.toString(),
          lng: this.lng.toString(),
          username: localStorage.getItem("username"),
        });

        var requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: raw,
          redirect: "follow",
        };

        fetch("http://localhost:8000/api/companies", requestOptions)
          .then((response) => response.text())
          .then((result) => this.processResult(JSON.parse(result)))
          .catch((error) => this.processResult(JSON.parse(error)));
      }
      },

    getSector(index) {
      return this.sectorArray[index];
    },
    getName(index) {
      return this.nameArray[index];
    },
    getAddress(index) {
      return this.addressArray[index];
    },
    innerClick() {
      alert("Click!");
    },
    processResult(result) {
      if (result["code"] != undefined) {
        if (result["code"] == 401) {
          alert("Su sesión ha expirado! Inicie sesion de nuevo");
          setTimeout(function () {
            location.replace("http://127.0.0.1:8080/login");
          }, 5000);
        }
      }
      if (result["@type"] != undefined) {
        if (result["@type"] == "hydra:error") {
          alert("Error al enviar el formulario");
        }
        if (result["@type"] == "Company") {
          this.updateUser();
          alert("Su empresa ya esta disponible en el Servidor");
          setTimeout(function () {
            location.replace("http://127.0.0.1:8080/map");
          }, 1500);
        }
      }
    },
    updateUser() {
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/merge-patch+json");
      myHeaders.append(
        "Authorization",
        "Bearer " + localStorage.getItem("token")
      );

      var raw = JSON.stringify({
        companyAdded: true,
      });

      var requestOptions = {
        method: "PATCH",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      fetch(
        "http://localhost:8000" + localStorage.getItem("username"),
        requestOptions
      )
        .then((response) => response.text())
        .then((result) => console.log(result))
        .catch((error) => console.log("error", error));
    },
    fetchAddress() {
      //https://nominatim.openstreetmap.org/search.php?q=paseo+de+zorrilla+30&format=json

      if (document.getElementById("direccion") != null) {
        console.log("Aqui ");
        var search = document.getElementById("direccion").value;
        var s = search.replace(/\s/g, "+");

        var requestOptions = {
          method: "GET",
          redirect: "follow",
        };

        fetch(
          "https://nominatim.openstreetmap.org/search.php?q=" +
            s +
            "&format=json",
          requestOptions
        )
          .then((response) => response.text())
          .then((result) => this.processAddress(JSON.parse(result)))
          .catch((error) => console.log("error", error));
      } else {
        console.log("Hola");
      }
    },
    processClick(result) {
      document.getElementById("search").value = result.display_name;
      document.getElementById("results").style.display = "none";
      this.direccionCompleta = result.display_name;
      if (this.i > 0) {
        this.markers.splice(this.markers.length - 1, 1);
      } else {
        this.i++;
      }
      this.markers.push(this.markerLatLng(result.lat, result.lon));
      this.lat = result.lat;
      this.lng = result.lon;

      console.log(result.lat);
      console.log(result.lon);
    },
  },
};
</script>
