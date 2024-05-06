<template>
  <div
    class="container-map position-relative d-flex flex-column justify-content-between"
  >
    <div class="map flex-grow-1">
      <GMapMap
        ref="map"
        :center="center"
        :zoom="zoom"
        map-type-id="terrain"
        style="width: 100%; height: 100%"
      >
        <GMapCluster :zoomOnClick="true">
          <GMapMarker
            :position="getOperatorMarker.position"
            :icon="getOperatorMarker.icon"
            :clickable="true"
            :draggable="false"
            @click="clickOperatorMarker(getOperatorMarker)"
          >
            <GMapInfoWindow
              :closeclick="true"
              @closeclick="openMarker(null)"
              :opened="openedMarkerId === getOperatorMarker.id"
            >
              <div>OPERADOR</div>
            </GMapInfoWindow>
          </GMapMarker>

          <GMapMarker
            v-for="(marker, index) in getClientsMarkers"
            :key="index"
            :position="marker.position"
            :icon="marker.icon"
            :clickable="true"
            :draggable="false"
            @click="openMarker(marker.id)"
          >
            <GMapInfoWindow
              :closeclick="true"
              @closeclick="openMarker(null)"
              :opened="openedMarkerId === marker.id"
            >
              <div>
                <strong class="d-block mb-1">{{ marker.name }}</strong>
                <p class="m-0">Tiempo de servicio: {{ marker.serviceTime }}</p>
                <p class="m-0">{{ marker.address }}</p>
                <p class="m-0" v-if="marker.deliveryStatus">
                  {{ marker.deliveryStatus }}
                </p>
                <p
                  v-else
                  class="text-primary m-0"
                  @click="goHandle(marker.deliveryId)"
                >
                  Gestionar entrega
                </p>
              </div>
            </GMapInfoWindow></GMapMarker
          >
        </GMapCluster>
      </GMapMap>
    </div>
    <div
      v-if="getClientsWithoutPosition.length > 0"
      class="container-without-coords"
    >
      <p class="text-danger m-0 my-1">
        <i class="fas fa-exclamation-triangle mr-2"></i>Clientes sin
        geolocalizacion
      </p>

      <ul class="list-group">
        <li
          class="list-group-item p-0 d-flex justify-content-between"
          v-for="client in getClientsWithoutPosition"
          :key="client.id"
        >
          <span>{{ client.name }}</span>
          <a :href="'tel:+51' + client.phone" class="text-primary"
            >Telf: +51 {{ client.phone }}</a
          >
        </li>
      </ul>
    </div>
  </div>
</template>
<script></script>

<script>
import { mapMutations } from 'vuex'
import { loaderPage } from '../../helpers/loaderPage'
import Geolocation from '@/helpers/geolocation'
import Route from '@/helpers/route'

//Images
let operatorIcon = require('@/assets/markers/operator.png')
let deliveredIcon = require('@/assets/markers/delivered.svg')
let partialIcon = require('@/assets/markers/partial.svg')
let notDeliveredIcon = require('@/assets/markers/notDelivered.svg')
let devolutionIcon = require('@/assets/markers/devolution.svg')

export default {
  data() {
    return {
      token: localStorage.getItem('token-operator'),
      zoom: 5,
      center: { lat: -12.03600510418158, lng: -77.04066137432721 }, //Lima
      clients: [],
      openedMarkerId: null,
      operatorCoord: { lat: 0, lng: 0 },
      google: null,
    }
  },
  computed: {
    getOperatorMarker() {
      let marker = {}
      marker.id = 0
      marker.position = this.operatorCoord
      marker.icon = operatorIcon

      return marker
    },
    getClientsMarkers() {
      let clients = this.getClientsWithPosition

      let markers = clients.map((client) => {
        client.position = {
          lat: Number(client.latitude),
          lng: Number(client.longitude),
        }
        client.icon = this.getIcon(client.deliveryStatus)
        return client
      })
      return markers
    },
    getClientsWithPosition() {
      let clients = this.clients.filter(
        (el) => el.latitude != 0 && el.longitude != 0
      )
      return clients
    },
    getClientsWithoutPosition() {
      let clients = this.clients.filter(
        (el) => el.latitude == 0 && el.longitude == 0
      )
      return clients
    },

    getPendingClients() {
      let clients = this.getClientsWithPosition.filter(
        (el) => !el.deliveryStatus
      )

      return clients
    },

    getMarkerWithMinServiceTime() {
      let onlyServiceTime = this.getPendingClients.map((el) => el.serviceTime)
      let minServiceTime = Math.min(...onlyServiceTime)

      let clientMarker = this.getClientsMarkers.find(
        (el) => el.serviceTime == minServiceTime
      )

      return clientMarker
    },
    getNextClientMarker() {},

    getPath() {
      let clients = this.getClientsWithPosition

      let path = clients.map((client) => ({
        lat: Number(client.latitude),
        lng: Number(client.longitude),
      }))

      return path
    },
  },
  methods: {
    ...mapMutations(['setAppError', 'setManagementStatus']),
    async getClients() {
      try {
        const URL = `${process.env.VUE_APP_API_OPERATOR}/clients/latest`

        let res = await fetch(URL, {
            headers: {
              Authorization: 'Bearer ' + this.token,
            },
          }),
          response = await res.json()
        if (response.error) throw response
        return response
      } catch (error) {
        let message =
          error.statusText ||
          `Error de Front: Al obtener clientes de operador: ${error}`
        this.setAppError(message)
      }
    },
    openMarker(id) {
      this.openedMarkerId = id
    },
    setCenter(position) {
      this.center = position
    },
    clickOperatorMarker(operatorMarker) {
      this.zoom = 18
      this.openMarker(operatorMarker.id)
    },

    getIcon(status) {
      if (status == 'Entregado') return deliveredIcon
      if (status == 'Entrega Parcial') return partialIcon
      if (status == 'No Entregado') return notDeliveredIcon
      if (status == 'Devoluciones Programadas') return devolutionIcon
    },
    goHandle(deliveryId) {
      this.setManagementStatus('En Ruta')
      localStorage.setItem('deliveryId', deliveryId)
      this.$router.push({ name: 'handle' })
    },
  },
  async mounted() {
    let loader = loaderPage(this.$loading, 'container-map')

    //set my position
    let myPosition = await Geolocation().actualPosition()
    this.operatorCoord = {
      lat: myPosition.coords.latitude,
      lng: myPosition.coords.longitude,
    }

    //set clients positions
    this.setCenter(this.operatorCoord)

    let response = await this.getClients()
    if (typeof response === 'undefined') return

    if (response.status == 'success') {
      this.clients = response.data.clients
    }

    //set route
    /*     let nextCustomer = getNext(this.coords)
    if (!nextCustomer) {
      console.log('ENTREGAS YA GESTIONADAS!')
      loader.hide()
      return
    } */

    this.$refs.map.$mapPromise.then((mapObject) => {
      //Set route
      Route(
        this.getOperatorMarker.position,
        this.getMarkerWithMinServiceTime.position,
        mapObject,
        google
      )
      //Update my position
      Geolocation().watchPosition(
        (position) => {
          this.operatorCoord = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }

          //Update route
          Route(
            this.getOperatorMarker.position,
            this.getMarkerWithMinServiceTime.position,
            mapObject,
            google
          )
        },
        (err) => {
          console.log('ERROR AL RASTREAR OPERADOR: ', err)
        }
      )
    })

    /*     let markerNext = this.markers.find(
      (el) => el.identificador == nextCustomer.id
    )

    route(markerMe, markerNext, this.map, this.google) */
    loader.hide()

    /*
    const loaderMap = new Loader(process.env.VUE_APP_MAPS_KEY, {})

    this.coords = await this.getClients()
    console.log(this.coords)

    //set variables
    this.google = await loaderMap.load()
    this.map = new this.google.maps.Map(document.getElementById('map'), {
      zoom: 18,
      center: { lat: -12.03600510418158, lng: -77.04066137432721 }, //lIMA
    })
    this.marker = Marker(this.google)
    this.geolocation = Geolocation(this.google)
    this.info = Info(this.google)

    //set my position
    let myPosition = await this.geolocation.actualPosition()

    let markerMe = this.marker.operator(myPosition)
    this.info.label(markerMe, 'Tú')
    markerMe.setMap(this.map)
    this.markers.push(markerMe)

    //set customers position
    this.setCustomersMarkers(this.coords)

    //Middle map
    this.map.setCenter(myPosition)

    //set route
    let nextCustomer = getNext(this.coords)
    if (!nextCustomer) {
      console.log('ENTREGAS YA GESTIONADAS!')
      loader.hide()
      return
    }

    let markerNext = this.markers.find(
      (el) => el.identificador == nextCustomer.id
    )


    //markerNext.setIcon("./assets/markers/next.svg")


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
        console.log('WATCH_POSITION_ERROR: ', err)
      }
    ) */
  },
}
</script>
<style scoped>
.container-map {
  height: 90vh;
}

.container-without-coords {
  font-size: 13px;
  height: 80px;
}

.container-without-coords .list-group {
  font-size: 12px;
  height: 60px;
  overflow-y: auto !important;
}
</style>
