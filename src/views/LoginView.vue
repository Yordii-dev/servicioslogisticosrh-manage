<template>
  <div class="container-login">
    <noData v-if="textNoData" :text="textNoData" />
    <div v-else>
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
              v-model="vehicleId"
              required
            >
              <option
                v-for="vehicle in operators"
                v-bind:key="vehicle.vehicleId"
                :value="vehicle.vehicleId"
              >
                {{ vehicle.patent }}
              </option>
            </select>

            <small class="vehicleHelp form-text text-muted text-right">{{
              operators.length == 0 && isFetch ? 'Sin vehiculos' : ''
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
              >{{ userExist && isFetchUsers ? '' : 'Pin desconocido' }}</small
            >
          </div>
        </div>
        <br />

        <button
          class="btn-ingresar border-0 text-white w-100 py-2"
          type="submit"
        >
          <span
            class="spinner-border spinner-border-sm mx-1"
            :class="spinnerButton ? '' : 'd-none'"
            role="status"
            aria-hidden="true"
          ></span>

          Iniciar sesión
        </button>
      </form>
    </div>
  </div>
</template>
<script>
import noData from '../components/noData.vue'
import { mapMutations } from 'vuex'
export default {
  components: { noData },
  data() {
    return {
      textNoData: null,
      operators: [],
      userExist: false,
      isFetchUsers: false,
      isFetch: false,
      spinnerButton: false,

      vehicleId: null,
      pin: null,
    }
  },
  methods: {
    ...mapMutations(['setAppError']),

    async signIn() {
      try {
        const URL = `${process.env.VUE_APP_API_OPERATOR}/signin`
        let res = await fetch(URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ vehicleId: this.vehicleId, pin: this.pin }),
          }),
          response = await res.json()
        if (response.error) throw response
        return response
      } catch (error) {
        let message =
          error.statusText || `Error de Front: Al iniciar sesion: ${error}`
        this.setAppError(message)
      }
    },
    async validate() {
      this.spinnerButton = true

      let response = await this.signIn()

      if (typeof response === 'undefined') return

      if (response.status == 'success') {
        this.userExist = true
        localStorage.setItem('token-operator', response.data.token)
        this.$router.push({ name: `route` })
      }

      this.isFetchUsers = true
      this.spinnerButton = false
    },
    getUserIdFromUrl() {
      return this.$route.params.userId
    },
    async getUser(userId) {
      try {
        const URL = `${process.env.VUE_APP_API_USER}/users/${userId}`
        let res = await fetch(URL),
          response = await res.json()
        this.isFetch = true
        if (response.error) throw response

        return response
      } catch (error) {
        let message =
          error.statusText || 'Error de Front: Al obtener usuario de local'
        this.setAppError(message)
      }
    },
    async existsUser(userId) {
      let responseUser = await this.getUser(userId)

      if (typeof responseUser === 'undefined') return

      if (responseUser.status == 'success') return true

      return false
    },
    async getActiveOperators(userId) {
      try {
        const URL = `${process.env.VUE_APP_API_USER}/operators/A/${userId}`
        let res = await fetch(URL),
          response = await res.json()
        this.isFetch = true
        if (response.error) throw response

        return response
      } catch (error) {
        let message =
          error.statusText ||
          'Error de Front: Al obtener vehiculos de operadores activos'
        this.setAppError(message)
      }
    },
  },
  async mounted() {
    let userId = this.getUserIdFromUrl()
    if (!userId) {
      this.textNoData = 'Espacio de trabajo no especificado'
      return
    }

    localStorage.setItem('userId', userId) // for button 'back' of router

    let exists = await this.existsUser(userId)

    if (!exists) {
      this.textNoData = 'Espacio de trabajo desconocido'
      return
    }

    //Get active operators
    let response = await this.getActiveOperators(userId)
    if (typeof response === 'undefined') return

    if (response.status == 'success') {
      this.operators = response.data.operators
    }
  },
}
</script>

<style scoped>
.container-login {
  position: absolute;
  left: 0;
  right: 0;
  height: 100%;
  background: #ffffef url('../assets/bg-login.jpeg') no-repeat top;
  background-size: cover;
}
form {
  backdrop-filter: blur(5px);
  margin-top: 220px !important;
}
select {
  height: 48px !important;
  font-size: 18px !important;
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
