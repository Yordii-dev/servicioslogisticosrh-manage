<template>
  <div>
    <div
      :class="{ 'd-none': coord.lat == 0 }"
      id="map"
      class="map w-100 m-auto"
    ></div>

    <div :class="{ 'd-none': coord.lat != 0 }">
      <AnyGeoModal />
    </div>
  </div>
</template>

<script>
import AnyGeoModal from "../modals/AnyGeoModal.vue"
import { Loader } from "google-maps"
import { Info } from "@/helpers/info"
export default {
  props: ["coord"],
  components: { AnyGeoModal },
  data() {
    return {
      info: null,
    }
  },

  async mounted() {
    const loader = new Loader(process.env.VUE_APP_MAPS_KEY, {}),
      google = await loader.load()

    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 18,
      center: this.$props.coord,
    })

    const marker = new google.maps.Marker({
      position: this.$props.coord,
      map: map,
    })
    this.info = Info(google)
    this.info.label(marker, this.$props.coord.service_time)
    this.info.windows(marker, this.$props.coord)
  },
}
</script>
<style scoped>
.map {
  height: 90vh;
}
</style>
