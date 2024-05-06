<template>
  <div class="container">
    <RowBack back="management/info"></RowBack>
    <ClientMap :coord="coord"></ClientMap>
  </div>
</template>
<script>
import RowBack from "@/components/RowBack.vue"
import ClientMap from "../components/maps/ClientMap.vue"
export default {
  components: { ClientMap, RowBack },
  data() {
    return {
      idDelivery: localStorage.getItem("selected-delivery"),
      coord: [],
    }
  },
  mounted() {
    //Hidden Nav
    this.$store.state.hideNav = true

    const deliveries = JSON.parse(localStorage.getItem("deliveries"))
    const delivery = deliveries.find((el) => el.id == this.idDelivery)
    this.coord = {
      lat: Number(delivery.compra.cliente.latitud),
      lng: Number(delivery.compra.cliente.longitud),
      name: delivery.compra.cliente.nombre,
      address: delivery.compra.cliente.direccion,
      phone: delivery.compra.cliente.telefono,
      service_time: delivery.tiempo_servicio,
    }
  },
}
</script>
