<template>
  <div class="container-start">
    <RedirectInfo
      v-show="visibleRedirectInfo"
      :tittle="redirectInfoProps.tittle"
      :detail="redirectInfoProps.detail"
      :pageToReturn="redirectInfoProps.pageToReturn"
    />
    <RowBack class="container" pageName="login" :params="{ userId }"></RowBack>

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
          <span :class="routeStarted ? 'routeStarted' : 'h6'">{{
            startDate
          }}</span>
        </div>
        <div class="hora d-flex justify-content-between">
          <span class="text-secondary">Hora de Inicio</span>
          <span :class="routeStarted ? 'routeStarted' : 'h6'">{{
            startTime
          }}</span>
        </div>
        <div class="vehiculo d-flex justify-content-between">
          <span class="text-secondary">Vehiculo</span>
          <span :class="routeStarted ? 'routeStarted' : 'h6'">{{
            patent
          }}</span>
        </div>
        <div class="entrega d-flex justify-content-between">
          <span class="text-secondary">Entregas</span>

          <span :class="routeStarted ? 'routeStarted' : 'h6'">{{
            totalDeliveries
          }}</span>
        </div>
      </div>
      <SpinnerButton
        @click="goToDeliveries"
        classes="h6 fixed-bottom text-center text-decoration-none p-3 border-0"
        :loading="loaderSpinner"
        :text="routeStarted ? 'CONTINUAR RUTA' : 'CONFIRMAR E INICIAR RUTA'"
        textLoading="PROCESANDO"
      />
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import RowBack from '@/components/RowBack.vue'
import SpinnerButton from '@/components/SpinnerButton.vue'
import { loaderPage } from '@/helpers/loaderPage'
import { actualDateTime, onlyDate, onlyTime } from '@/helpers/date'
import { validateRoutePage } from '../validations/validateRoutePage'
import RedirectInfo from '@/components/RedirectInfo.vue'

export default {
  components: { RowBack, SpinnerButton, RedirectInfo },
  data() {
    return {
      token: localStorage.getItem('token-operator'),
      userId: localStorage.getItem('userId'), // For back button
      loaderSpinner: false,
      visibleRedirectInfo: false,
      redirectInfoProps: {},

      routeStarted: false,

      startDate: '',
      startTime: onlyTime(actualDateTime()),
      patent: '',
      totalDeliveries: 0,
    }
  },

  methods: {
    ...mapMutations(['setAppError']),
    showLocaleTime() {
      setInterval(() => {
        this.startTime = new Date().toLocaleTimeString()
      }, 1000)
    },
    getToken() {
      return localStorage.getItem('token-operator')
    },
    async getThisOperator() {
      try {
        const URL = `${process.env.VUE_APP_API_OPERATOR}/operators-self`

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
          `Error de Front: Al obtener datos del actual operador`
        this.setAppError(message)
      }
    },

    async getTotalDeliveries() {
      try {
        const URL = `${process.env.VUE_APP_API_OPERATOR}/deliveries-total/latest`

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
          `Error de Front: Al obtener total de entregas: ${error}`
        this.setAppError(message)
      }
    },

    async getRoute() {
      try {
        const URL = `${process.env.VUE_APP_API_OPERATOR}/route/latest`

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
          error.statusText || `Error de Front: Al obtener ruta: ${error}`
        this.setAppError(message)
      }
    },

    async createRoute() {
      try {
        const URL = `${process.env.VUE_APP_API_OPERATOR}/route`
        let res = await fetch(URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + this.getToken(),
            },
            body: JSON.stringify({ date: actualDateTime() }),
          }),
          response = await res.json()
        if (response.error) throw response
        return response
      } catch (error) {
        let message =
          error.statusText || `Error de Front: Al comenzar ruta: ${error}`
        this.setAppError(message)
      }
    },

    async goToDeliveries() {
      this.loaderSpinner = true
      if (!this.routeStarted) {
        //Create route
        let response = await this.createRoute()

        if (typeof response == 'undefined') return

        if (response.status == 'success') {
          this.$router.push({ name: `deliveries` })
        }

        if (response.status == 'fail') {
          alert(`${response.data.message}: ${response.data.details[0]}`)
        }
      } else {
        //Continue route
        this.$router.push({ name: `deliveries` })
      }
      this.loaderSpinner = false
    },
  },
  async mounted() {
    try {
      let loader = loaderPage(this.$loading)
      let { validate, pageToReturn } = await validateRoutePage()

      if (validate.error) throw validate

      if (validate.status == 'fail') {
        this.visibleRedirectInfo = true
        this.redirectInfoProps = {
          tittle: validate.data.message,
          detail: validate.data.details,
          pageToReturn: pageToReturn,
        }
        loader.hide()
        return
      }

      //Get Vehicle
      let responseOperator = await this.getThisOperator()

      if (typeof responseOperator == 'undefined') return

      if (responseOperator.status == 'success') {
        this.patent = responseOperator.data.operator.patent
      }

      //Get Total Deliveries
      let responseTotal = await this.getTotalDeliveries()
      if (typeof responseTotal == 'undefined') return
      if (responseTotal.status == 'success') {
        this.totalDeliveries = responseTotal.data.total
      }

      //Get Route
      let response = await this.getRoute()

      if (typeof response === 'undefined') return

      if (response.status == 'success') {
        this.routeStarted = true
        this.startDate = onlyDate(response.data.route.date)
        this.startTime = onlyTime(response.data.route.date)
      }

      if (response.status == 'fail') {
        this.startDate = onlyDate(actualDateTime())
        this.showLocaleTime() //StartTime in real time
      }
      loader.hide()
    } catch (error) {
      let message =
        error.statusText || 'Error de Front: Al montar pagina ruta' + error
      this.setAppError(message)
    }
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

.routeStarted {
  font-weight: 100 !important;
}
</style>
