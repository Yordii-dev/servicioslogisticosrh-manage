<template>
  <div class="container-map position-relative">
    <div v-if="getMarker.position" class="w-100 h-100 m-auto">
      <GMapMap
        :center="center"
        :zoom="18"
        map-type-id="terrain"
        style="width: 100%; height: 100%"
      >
        <GMapMarker
          :position="getMarker.position"
          :clickable="true"
          :draggable="false"
          @click="openedMarker = true"
        >
          <GMapInfoWindow
            :closeclick="true"
            @closeclick="openedMarker = false"
            :opened="openedMarker"
          >
            <div>{{ getMarker.name }} <MyComponent /></div> </GMapInfoWindow
        ></GMapMarker>
      </GMapMap>
    </div>
    <noData v-else text="CLIENTE SIN GEOPOSICION" />
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import { loaderPage } from '../../helpers/loaderPage'
import noData from '../noData.vue'

export default {
  components: { noData },
  data() {
    return {
      deliveryId: localStorage.getItem('deliveryId'),
      center: { lat: -12.03600510418158, lng: -77.04066137432721 }, //Lima
      client: {},
      openedMarker: true,
    }
  },
  computed: {
    getMarker() {
      let marker = this.client
      marker.id = 1

      if (marker.latitude != 0 && marker.longitude != 0) {
        marker.position = {
          lat: Number(marker.latitude),
          lng: Number(marker.longitude),
        }
      }

      this.setCenter(marker.position)
      //marker.icon = operatorIcon
      return marker
    },
  },
  methods: {
    ...mapMutations(['setAppError']),
    async getClient(deliveryId) {
      try {
        const URL = `${process.env.VUE_APP_API_DELIVERY}/client/${deliveryId}`

        let res = await fetch(URL),
          response = await res.json()
        if (response.error) throw response
        return response
      } catch (error) {
        let message =
          error.statusText ||
          `Error de Front: Al obtener cliente de entrega` + error
        this.setAppError(message)
      }
    },

    setCenter(position) {
      this.center = position
    },
  },

  async mounted() {
    let loader = loaderPage(this.$loading, '.container-map')
    let response = await this.getClient(this.deliveryId)

    if (typeof response === 'undefined') return

    if (response.status == 'success') {
      this.client = response.data.client
    }
    loader.hide()
  },
}
</script>
<style scoped>
.container-map {
  height: 90vh;
}
</style>
