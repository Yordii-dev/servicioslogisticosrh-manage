<template>
  <div class="container">
    <RowBack back="clients"></RowBack>
    <ClientsMap :coords="coords"></ClientsMap>
  </div>
</template>
<script>
import RowBack from "../components/RowBack.vue"
import ClientsMap from "../components/maps/ClientsMap.vue"
export default {
  components: { ClientsMap, RowBack },
  data() {
    return {
      idDelivery: localStorage.getItem("selected-delivery"),
      coords: [],
    }
  },
  mounted() {
    //Hidden Nav
    this.$store.state.hideNav = true

    const deliveries = JSON.parse(localStorage.getItem("deliveries"))

    this.coords = deliveries.map((el) => ({
      id: el.compra.cliente.id,
      lat: Number(el.compra.cliente.latitud),
      lng: Number(el.compra.cliente.longitud),
      name: el.compra.cliente.nombre,
      address: el.compra.cliente.direccion,
      status: el.gestion,
      service_time: el.tiempo_servicio,
      phone: el.compra.cliente.telefono,
    }))
  },
}
</script>
