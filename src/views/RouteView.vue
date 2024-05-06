<template>
  <div class="container-start">
    <RowBack class="container" back="/"></RowBack>

    <div class="container-check position-relative">
      <div class="check d-flex flex-column align-items-center">
        <i class="fa-solid fa-circle-check"></i>
        <span class="h4">Todo Listo!</span>
      </div>
      <hr />
      <div
        class="details mx-3 h-50 p-2 justify-content-between d-flex flex-column"
      >
        <div class="fecha d-flex justify-content-between">
          <span class="text-secondary">Fecha de Ruta</span>
          <span :class="isStarted ? 'isStarted' : 'h6'">{{ startDate }}</span>
        </div>
        <div class="vehiculo d-flex justify-content-between">
          <span class="text-secondary">Vehiculo</span>
          <span :class="isStarted ? 'isStarted' : 'h6'">{{ vehicle }}</span>
        </div>
        <div class="entrega d-flex justify-content-between">
          <span class="text-secondary">Entregas</span>

          <span :class="isStarted ? 'isStarted' : 'h6'">{{
            deliveriesAmount
          }}</span>
        </div>
        <div class="hora d-flex justify-content-between">
          <span class="text-secondary">Hora de Inicio</span>
          <span :class="isStarted ? 'isStarted' : 'h6'">{{ startHour }}</span>
        </div>
      </div>
      <button
        @click="href"
        :disabled="deliveries == 0"
        :class="deliveries == 0 ? 'bg-muted' : 'bg-primary text-white'"
        class="h6 fixed-bottom text-center text-decoration-none p-3 border-0"
      >
        <span
          class="spinner spinner-border spinner-border-sm"
          :class="{ 'd-none': !spinnerButton }"
          role="status"
          aria-hidden="true"
        ></span>
        {{ isStarted ? "CONTINUAR RUTA" : "CONFIRMAR E INICIAR RUTA" }}
      </button>
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
import RowBack from "@/components/RowBack.vue"

export default {
  components: { RowBack },
  data() {
    return {
      spinnerButton: false,
      isStarted: false,
      fullPage: true,

      vehicle: "",
      startDate: "",
      deliveriesAmount: "",
      startHour: "",

      error: false,
    }
  },
  methods: {
    actualDate() {
      const now = new Date()
      const offsetMs = now.getTimezoneOffset() * 60 * 1000
      const dateLocal = new Date(now.getTime() - offsetMs)
      const str = dateLocal
        .toISOString()
        .slice(0, 19)
        .replace(/-/g, "-")
        .replace("T", " ")

      return str
    },

    async getRoute() {
      try {
        const URL = `${process.env.VUE_APP_API}/route`

        let res = await fetch(URL, {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token_user"),
            },
          }),
          json = await res.json()

        return json
      } catch (error) {
        this.error = `Error al obtener informacion de ruta: ${error}`
      }
    },
    async startRoute() {
      try {
        const URL = `${process.env.VUE_APP_API}/route`
        let res = await fetch(URL, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("token_user"),
            },

            body: JSON.stringify({
              fecha: this.startDate,
              hora: this.startHour,
            }),
          }),
          json = await res.json()
        return json
      } catch (error) {
        this.error = `Error al iniciar ruta: ${error}`
      }
    },
    async href() {
      this.spinnerButton = true
      //Create route
      if (this.isStarted == false) {
        let route = await this.startRoute()

        if (route.affectedRows > 0) {
          this.$router.push({ name: `deliveries` })
        } else {
          alert("No se puedo crear la ruta!")
        }
      } else {
        //Continue route
        this.$router.push({ name: `deliveries` })
      }
      this.spinnerButton = false
    },
  },
  async mounted() {
    let loader = this.$loading.show({
      // Optional parameters
      container: document.querySelector(".container-check"),
      canCancel: false,
      color: "rgb(27, 209, 155)",
      height: "40",

      onCancel: this.onCancel,
    })

    let route = await this.getRoute()
    if (route === undefined) return

    if (route.startDate !== null) {
      this.isStarted = true

      this.startDate = route.startDate.split("T")[0]
      this.vehicle = route.vehicle
      this.deliveriesAmount = route.deliveriesAmount
      this.startHour = route.startHour
    } else {
      this.vehicle = route.vehicle
      this.deliveriesAmount = route.deliveriesAmount
      this.startDate = this.actualDate().split(" ")[0]
      this.startHour = this.actualDate().split(" ")[1]
    }

    loader.hide()
  },
}
</script>

<style scoped>
.container-start {
  height: 100vh;
}

.check i {
  font-size: 100px;
  color: rgba(3, 6, 170, 0.89);
  padding: 20px;
}
.container-check {
  margin-top: 2vh;
  height: 90vh;
}

.container-check > div {
  flex-basis: 50%;
}

.isStarted {
  font-weight: 100 !important;
}
</style>
