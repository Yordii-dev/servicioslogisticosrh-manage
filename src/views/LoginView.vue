<template>
  <div class="container-login">
    <form class="mx-3" @submit.prevent="validate">
      <div>
        <div class="form-group form-group-vehicle">
          <div class="d-flex justify-content-end">
            <div
              class="text-secondary spinner"
              :class="isFetch ? 'd-none' : ''"
            >
              <span
                class="mx-2 spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              ></span>
              <small>Cargando vehiculos</small>
            </div>
          </div>
          <select
            name="vehiculo"
            class="form-control"
            aria-describedby="emailHelp"
            v-model="idVehicle"
            required
          >
            <option
              v-for="vehicle in vehicles"
              v-bind:key="vehicle.id"
              :value="vehicle.id"
            >
              {{ vehicle.placa }}
            </option>
          </select>

          <small class="vehicleHelp form-text text-muted text-right">{{
            vehicles.length == 0 && isFetch ? "Sin vehiculos" : ""
          }}</small>
        </div>
        <br />
        <div class="form-group">
          <input
            name="pin"
            type="password"
            class="form-control border-1 py-4"
            v-model="pin"
            placeholder="Pin"
            required
          />
          <small
            v-if="isFetchUsers"
            class="pinHelp"
            :class="userExist && isFetchUsers ? '' : 'text-danger'"
            >{{ userExist && isFetchUsers ? "" : "Pin desconocido" }}</small
          >
        </div>
      </div>
      <br />

      <button class="btn-ingresar border-0 text-white w-100 py-2" type="submit">
        <span
          class="spinner-border spinner-border-sm mx-1"
          :class="spinnerButton ? '' : 'd-none'"
          role="status"
          aria-hidden="true"
        ></span>

        Iniciar sesión
      </button>
    </form>
    <div
      v-show="error != false"
      class="fixed-bottom alert-danger w-100 py-3 text-center"
    >
      {{ error }}
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      userExist: false,
      isFetchUsers: false,
      isFetch: false,
      idVehicle: null,
      pin: null,
      spinnerButton: false,
      vehicles: [],

      error: false,
    }
  },
  methods: {
    async signIn() {
      try {
        const URL = `${process.env.VUE_APP_API}/signinManage`
        let res = await fetch(URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ idVehicle: this.idVehicle, pin: this.pin }),
          }),
          json = await res.json()
        return json
      } catch (error) {
        this.error = `Error al obtener usuario: ${error}`
      }
    },
    async validate() {
      this.spinnerButton = true

      let token = await this.signIn()

      if (typeof token === "undefined") return

      if (token !== null) {
        localStorage.setItem("token_user", token)
        this.userExist = true
        this.$router.push({ name: `route` })
      }

      this.isFetchUsers = true
      this.spinnerButton = false
    },
  },

  async mounted() {
    try {
      const URL = `${process.env.VUE_APP_API}/vehicles`
      let res = await fetch(URL),
        json = await res.json()
      this.vehicles = json
      this.isFetch = true
    } catch (error) {
      this.error = `Error al obtener vehiculos: ${error}`
    }
  },
}
</script>

<style scoped>
select {
  height: 48px !important;
  font-size: 18px !important;
}
.container-login {
  position: absolute;
  left: 0;
  right: 0;
  height: 100vh;
  background: #ffffef url("../assets/bg-login.jpeg") no-repeat top;
  background-size: cover;
}
form {
  backdrop-filter: blur(5px);
  margin-top: 220px !important;
}
.vehicleHelp,
.pinHelp {
  font-style: italic;
}

.btn-ingresar {
  background: #142c8e;
  font-size: 20px;
  border-radius: 20px;
}
</style>
