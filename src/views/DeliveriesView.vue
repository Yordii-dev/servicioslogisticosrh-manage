<template>
  <div>
    <div class="clients-back d-flex justify-content-between align-items-center">
      <div class="mx-3">
        <RowBack back="route"></RowBack>
      </div>

      <router-link class="mx-4 my-0" :to="{ name: 'multiMap' }">
        Ver mapa
      </router-link>
    </div>
    <div class="container-user mt-5 mx-3">
      <Delivery
        v-for="delivery in deliveries"
        v-bind:key="delivery.idDelivery"
        :delivery="delivery"
      ></Delivery>
    </div>
    <div
      id="toolbar"
      class="alert-primary p-3 d-flex justify-content-between toolbar"
    >
      <span>Entregas: {{ deliveries.length }}</span>
      <span>Gestionadas: {{ lengthManaged }}</span>
    </div>
    <div
      v-show="error != false"
      class="fixed-bottom alert-danger w-100 py-3 text-center"
    >
      {{ error }}
    </div>
  </div>
</template>

<script>
import Delivery from "../components/Delivery.vue"
import RowBack from "../components/RowBack.vue"
export default {
  components: {
    Delivery,
    RowBack,
  },
  data() {
    return {
      data: {},
      deliveries: [],
      error: false,
    }
  },
  methods: {
    async getDeliveries() {
      try {
        const URL = `${process.env.VUE_APP_API}/deliveries`

        let res = await fetch(URL, {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token_user"),
            },
          }),
          json = await res.json()
        return json
      } catch (error) {
        this.error = `Error al obtener entregas: ${error}`
      }
    },
  },
  computed: {
    lengthManaged() {
      return this.deliveries.filter((el) => el.managed).length
    },
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
    const deliveries = await this.getDeliveries()

    if (typeof deliveries === "undefined") return
    console.log(deliveries)
    this.deliveries = deliveries

    loader.hide()
  },
}
</script>

<style scoped>
.clients-back {
  backdrop-filter: blur(5px);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
}

.container-user {
  margin-bottom: 100px;
}
.toolbar {
  font-style: italic;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>
