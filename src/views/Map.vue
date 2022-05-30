<template>
<Nav />
 <div id="map" class="map">
    <l-map
      v-if="showMap"
      :zoom="zoom"
      :center="center"
      :maxZoom="maxZoom"
      :minZoom="3"
      :isDraggable="false"
      :options="mapOptions"
      style="height: 100%"
      @update:center="centerUpdate"
      @update:zoom="zoomUpdate"
    >
      <l-control position="topright" class ="control">
        <select
        
    id="sector"
    name="sector"
    class=" form-select"
    @change="compareSector()"
  >
    <option value="default" class="bg-info" selected>
      Por favor, escoge un sector para filtrar
    </option>
    <option
      v-for="(sector, index) in sectors"
      v-bind:key="index"
      v-bind:value="sector"
    >
      {{ sector }}
    </option>
        </select>
      <Search />
      </l-control>
      <l-tile-layer :url="url" :attribution="attribution" />
      <l-marker
        v-for="(company, index) in companies"
        v-bind:key="index"
        :lat-lng="markerLatLng(company)"
      >
        <l-popup ref="popup">
          <div>
            Nombre:<b>{{ company.name }}</b
            ><br />
            Sector:<b>{{ company.sector }}</b
            ><br />
            Direccion Completa:<b>{{ company.address }}</b
            ><br />
          </div>
        </l-popup>
      </l-marker>
    </l-map>
  </div>
</template>

<script>
import { LMap, LTileLayer, LMarker, LPopup,LControl } from "@vue-leaflet/vue-leaflet";
import Search from "../components/Search.vue"

import Nav from "../components/Nav.vue"
//import { ref } from "vue";
import { latLng } from "leaflet";
import * as CSS from "../assets/styles/styles.css";
export default {
  name: "Map",
  components: {
    Search,
    LMap,
    LTileLayer,
    LMarker,
    LControl,
    LPopup,
    Nav
  },
  data() {
    return {
      fetch: this.fetchCompanies(localStorage.getItem("token"), ""),
      get: this.fetchSectors(localStorage.getItem("token")),
      maxZoom: 19,
      zoom: 10,
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
      companies: new Array(),
      sectors: new Array(),
    };
  },
  
  methods: {
    async onLeafletReady() {
      await this.$nextTick();
      this.leafletObject = this.$refs.map.leafletObject;
      this.leafletReady = true;
    },
    processClick(result) {
      document.getElementById("results").style.display = "none"
      this.center = latLng(result.lat,result.lon)
    },
    fetchSectors(token) {
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", "Bearer " + token);

      var requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      fetch("https://pana-api1.herokuapp.com/api/companies?sector=", requestOptions)
        .then((response) => response.text())
        .then((result) => {
          console.log(JSON.parse(result)["hydra:member"]);
          if (JSON.parse(result)["hydra:member"] != undefined) {
            var json = JSON.parse(result)["hydra:member"];
            for (var i = 0; i < json.length; i++) {
              if (!this.sectors.includes(json[i]["sector"])) {
                this.sectors.push(json[i]["sector"]);
              }
            }
          }
        })
        .catch((error) => console.log("error", error));
    },
    fetchCompanies(token, opt) {
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", "Bearer " + token);

      var requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      fetch("https://pana-api1.herokuapp.com/api/companies?sector=" + opt, requestOptions)
        .then((response) => response.text())
        .then((result) => {
          this.getCompanies(JSON.parse(result));
        })
        .catch((error) => console.log("error", error));
    },
    getCompanies(result) {
      this.companies = [];
      class Company {
        constructor(iri, name, sector, lat, lng, creator, address) {
          this.iri = iri;
          this.name = name;
          this.sector = sector;
          this.lat = lat;
          this.lng = lng;
          this.creator = creator;
          this.address = address;
        }
      }

      if (result["hydra:member"] != undefined) {
        var json = result["hydra:member"];
        for (var i = 0; i < json.length; i++) {
          var c = new Company(
            json[i]["@id"],
            json[i]["name"],
            json[i]["sector"],
            json[i]["lat"],
            json[i]["lng"],
            json[i]["username"],
            json[i]["fullAddress"]
          );
          this.companies.push(c);
        }
      } else if (json["code"] != undefined && json["code"] == 401) {
        setTimeout(function () {
          location.replace("https://pana2.vercel.app/login");
        }, 1000);
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
    compareSector() {
      if (document.getElementById("sector").value == "default") {
        this.fetchCompanies(localStorage.getItem("token"), "");
      } else {
        this.fetchCompanies(
          localStorage.getItem("token"),
          document.getElementById("sector").value
        );
      }
    },
    markerLatLng(company) {
      return latLng(company.lat, company.lng);
    },
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
};
</script>