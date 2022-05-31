<template>
        <div id="search" class="">
          <input
            type="text"
            id="search"
            class="search textbox"
            placeholder="Busqueda"
            v-model="searchQuery"
            @input="search"
          />
          <div id="results" >
            <div
              id="result"
              class="resultado"
              @click="this.$parent.$parent.$parent.processClick(result)"
              v-for="(result, index) in searchData"
              v-bind:key="index"
            >
              <p class="texto">
                {{ this.formatDisplay(result.display_name) }}
              </p>
            </div>
          </div>
        </div>
</template>

<script>

import { latLng } from "leaflet";
import { ref } from "vue";

import { OpenStreetMapProvider } from "leaflet-geosearch";
export default{
    name : "Search",
    components: {
    },
    data(){
        return{
            geosearchOptions: {
        // Important part Here
        provider: new OpenStreetMapProvider(),
      },
        }
    },
    methods: {
    updateCenter(lat,lng) {
      this.center = latLng(lat,lng)
    },
    formatDisplay(string){
      var maxL = 60;

      if(string.length > maxL){
        string = string.substring(0,maxL);
        return string
      }else{
        return string
      }
    }
    },
    setup() {
         const searchQuery = ref(null);

    const searchData = ref(null);

    const queryTimeout = ref(null);

    const search = () => {
      clearTimeout(queryTimeout.value);
      queryTimeout.value = setTimeout(() => {
        if(document.getElementById("results").style.display == "none"){
          document.getElementById("results").style.display = "inline-block"
        }
        if (searchQuery.value != "") {
          var myHeaders = new Headers();
          myHeaders.append("Content-Type", "application/ld+json");

          var requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow",
          };

          fetch(
            `https://nominatim.openstreetmap.org/search?q=${searchQuery.value}&format=json`,
            requestOptions
          )
            .then((response) => response.text())
            .then((result) => {
              searchData.value = JSON.parse(result);
            })
            .catch((error) => console.log("error", error));
        } else {
          searchData.value = "";
        }
      }, 750);
    };

    return {
      searchQuery,
      searchData,
      queryTimeout,
      search,
    };
    },
}
</script>
