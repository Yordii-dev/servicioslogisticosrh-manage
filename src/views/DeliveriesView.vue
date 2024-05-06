<template>
  <div>
    <RedirectInfo
      v-show="visibleRedirectInfo"
      :tittle="redirectInfoProps.tittle"
      :detail="redirectInfoProps.detail"
      :pageToReturn="redirectInfoProps.pageToReturn"
    />
    <div class="clients-back d-flex justify-content-between align-items-center">
      <div class="mx-3">
        <RowBack pageName="route"></RowBack>
      </div>

      <router-link class="mx-4 my-0" :to="{ name: 'multiMap' }">
        Ver mapa
      </router-link>
    </div>
    <div class="container-deliveries mt-5 mx-3">
      <Delivery
        v-for="client in clients"
        v-bind:key="client.id"
        :deliveryId="client.deliveryId"
        :deliveryStatus="client.deliveryStatus"
        :deliveryCt="client.ctDestination"
        :client="client"
      ></Delivery>
    </div>
    <div
      id="toolbar"
      class="alert-primary p-3 d-flex justify-content-between toolbar"
    >
      <span>Entregas: {{ clients.length }}</span>
      <span>Gestionadas: {{ totalManaged }}</span>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import Delivery from '../components/Delivery.vue'
import RowBack from '../components/RowBack.vue'
import { validateDeliveriesPage } from '../validations/validateDeliveriesPage'
import { loaderPage } from '@/helpers/loaderPage'
import RedirectInfo from '@/components/RedirectInfo.vue'
export default {
  components: {
    Delivery,
    RowBack,
    RedirectInfo,
  },
  data() {
    return {
      token: localStorage.getItem('token-operator'),
      visibleRedirectInfo: false,
      redirectInfoProps: {},
      clients: [],
      totalManaged: 0,
    }
  },
  methods: {
    ...mapMutations(['setAppError']),
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
    async getTotalManaged() {
      try {
        const URL = `${process.env.VUE_APP_API_OPERATOR}/managed-total/latest`

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
          `Error de Front: Al obtener total de gestiones: ${error}`
        this.setAppError(message)
      }
    },
  },

  async mounted() {
    try {
      let loader = loaderPage(this.$loading)
      let { validate, pageToReturn } = await validateDeliveriesPage()

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

      //getClients
      const responseClients = await this.getClients()

      if (typeof responseClients == 'undefined') return
      if (responseClients.status == 'success') {
        this.clients = responseClients.data.clients
      }

      //getTotalManaged
      const responseTotalManaged = await this.getTotalManaged()

      if (typeof responseTotalManaged == 'undefined') return
      if (responseTotalManaged.status == 'success') {
        this.totalManaged = responseTotalManaged.data.total
      }

      loader.hide()
    } catch (error) {
      let message =
        error.statusText || 'Error de Front: Al cargar pagina entregas'
      this.setAppError(message)
    }
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

.container-deliveries {
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
