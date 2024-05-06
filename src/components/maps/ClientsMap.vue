<template>
  <div class="container-map d-flex flex-column justify-content-between">
    <div id="map" class="map"></div>

    <div class="no_coords" v-if="markers_NO_COORDS.length > 0">
      <p class="text-warning m-0 my-1">
        <i class="fas fa-exclamation-triangle mr-2"></i>Clientes sin
        geolocalizacion
      </p>

      <ul class="list-group">
        <li
          class="list-group-item p-0 d-flex justify-content-between"
          v-for="noCoord in markers_NO_COORDS"
          :key="noCoord.id"
        >
          <span>{{ noCoord.name }}</span>
          <a :href="'tel:+51' + noCoord.phone" class="text-primary"
            >Telf: +51 {{ noCoord.phone }}</a
          >
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { Loader } from "google-maps"

import { Marker } from "@/helpers/marker"
import { Geolocation } from "@/helpers/geolocation"
import { Info } from "@/helpers/info"
import { getNext } from "@/helpers/next"
import { route } from "@/helpers/route"

export default {
  props: ["coords"],
  data() {
    return {
      marker: null,
      geolocation: null,
      info: null,
      map: null,
      google: null,
      markers: [],
      markers_NO_COORDS: [],
    }
  },
  async mounted() {
    let loader = this.$loading.show({
      // Optional parameters
      container: this.fullPage ? null : this.$refs.formContainer,
      canCancel: false,
      color: "rgb(27, 209, 155)",
      height: "40",
      onCancel: this.onCancel,
    })
    const loaderMap = new Loader(process.env.VUE_APP_MAPS_KEY, {})
    this.google = await loaderMap.load()

    this.map = new this.google.maps.Map(document.getElementById("map"), {
      zoom: 18,
      center: { lat: -12.03600510418158, lng: -77.04066137432721 }, //lIMA
    })

    this.marker = Marker(this.google)
    this.geolocation = Geolocation(this.google)
    this.info = Info(this.google)

    //set my position
    let myPosition = await this.geolocation.actualPosition()

    let markerMe = this.marker.operator(myPosition)
    this.info.label(markerMe, "Tú")
    markerMe.setMap(this.map)
    this.markers.push(markerMe)

    //set customers position
    this.setCustomersMarkers(this.$props.coords)

    //Middle map
    this.map.setCenter(myPosition)

    //set route
    let nextCustomer = getNext(this.$props.coords)
    if (!nextCustomer) {
      console.log("ENTREGAS YA GESTIONADAS!")
      loader.hide()
      return
    }

    let markerNext = this.markers.find(
      (el) => el.identificador == nextCustomer.id
    )

    /*
    markerNext.setIcon("./assets/markers/next.svg")
    */

    route(markerMe, markerNext, this.map, this.google)

    //Update my position
    this.geolocation.watchPosition(
      (position) => {
        markerMe.setPosition(
          new this.google.maps.LatLng(
            position.coords.latitude,
            position.coords.longitude
          )
        )

        //Update new route
        route(markerMe, markerNext, this.map, this.google)
      },
      (err) => {
        console.log("WATCH_POSITION_ERROR: ", err)
      }
    )
    loader.hide()
  },

  methods: {
    setCustomersMarkers(coords) {
      for (const coord of coords) {
        if (coord.lat == 0 || coord.lng == 0) {
          this.markers_NO_COORDS.push(coord)
          continue
        }

        let googleCoord = new this.google.maps.LatLng(coord.lat, coord.lng)

        let m = this.marker.customer(googleCoord, coord)
        m.setMap(this.map)
        if (coord.status) {
          let label =
            coord.status == "En Ruta" || coord.status == "Entrega Parcial"
              ? coord.status.split(" ")[1][0]
              : coord.status[0]
          this.info.label(m, label)
        } else {
          this.info.label(m, coord.service_time)
        }
        this.info.windows(m, coord)

        this.markers.push(m)
      }
    },
  },
}
</script>
<style scoped>
.container-map {
  height: 90vh;
  width: 100%;
  margin: auto !important;
}
.map {
  flex-grow: 1;
}
.no_coords {
  font-size: 13px;
  height: 80px;
}

.no_coords .list-group {
  font-size: 12px;
  height: 60px;
  overflow-y: auto !important;
}
</style>
