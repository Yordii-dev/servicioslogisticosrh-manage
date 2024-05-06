<template>
  <div class="container">
    <RedirectInfo
      v-show="visibleRedirectInfo"
      :tittle="redirectInfoProps.tittle"
      :detail="redirectInfoProps.detail"
      :pageToReturn="redirectInfoProps.pageToReturn"
    />
    <div class="addressee card p-3 mb-3 mt-3">
      <span>Destinatario</span>
      <p class="h6 mt-2 mb-5">{{ client.name }}</p>

      <div
        class="contacts float-right align-self-end d-flex justify-content-between"
      >
        <a
          :href="'tel:+51' + client.phone"
          class="call text-primary d-flex align-items-center text-decoration-none"
        >
          <i class="fa-solid fa-phone"></i>
          <span>Llamar</span>
        </a>
        <div
          class="notify text-primary d-flex align-items-center"
          data-toggle="modal"
          data-target="#modalNotify"
        >
          <i class="fa-solid fa-bell"></i>
          <span>Notificar</span>
        </div>
      </div>
    </div>

    <NotifyModal />

    <div class="card extra p-3">
      <div class="manager position-relative">
        <div class="d-flex align-items-center">
          <span>Gestor</span>
          <small class="mx-3 code h6 my-0">{{ manager.cod }}</small>
        </div>
        <small class="d-block font-weight-bold mt-2 mb-3 name">
          {{ manager.name }}
        </small>

        <div
          :class="
            Object.keys(manager).length == 0 || manager.phone == '×'
              ? 'invisible'
              : 'visible'
          "
          class="contacts float-right align-self-end d-flex justify-content-between"
        >
          <a
            :href="'tel:+51' + manager.phone"
            class="call text-primary d-flex align-items-center text-decoration-none"
          >
            <i class="fa-solid fa-phone"></i>
            <span>Llamar</span>
          </a>
          <a
            :href="
              'https://wa.me/+51' +
              manager.phone +
              '?text=Enviar mensaje a Gestor'
            "
            class="chat text-primary d-flex align-items-center text-decoration-none"
          >
            <i class="fa-brands fa-whatsapp"></i>
            <span>WhatsApp</span>
          </a>
        </div>
      </div>
      <hr />
      <div class="supervisor position-relative">
        <span>Supervisor</span>

        <small class="d-block font-weight-bold mt-2 mb-3 name">
          {{ supervisor.name }}
        </small>

        <div
          :class="
            Object.keys(supervisor).length == 0 || supervisor.phone == '×'
              ? 'invisible'
              : 'visible'
          "
          class="contacts float-right align-self-end d-flex justify-content-between"
        >
          <a
            :href="'tel:+51' + supervisor.phone"
            class="call text-primary d-flex align-items-center text-decoration-none"
          >
            <i class="fa-solid fa-phone"></i>
            <span>Llamar</span>
          </a>
          <a
            :href="
              'https://wa.me/+51' +
              supervisor.phone +
              '?text=Enviar mensaje a supervisor'
            "
            class="chat text-primary d-flex align-items-center text-decoration-none"
          >
            <i class="fa-brands fa-whatsapp"></i>
            <span>WhatsApp</span>
          </a>
        </div>
      </div>
    </div>

    <div class="d-flex delivery-address card p-3 pb-0 mt-3">
      <span>Direccion de entrega</span>
      <p class="h6 mt-2 mb-5">{{ client.address }}</p>

      <div class="map text-primary align-self-end d-flex align-items-center">
        <i class="fa-solid fa-diamond-turn-right"></i>
        <a href="singleMap">Mapa</a>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import NotifyModal from '../components/modals/NotifyModal.vue'
import { validateInfoPage } from '../validations/validateInfoPage'
import { loaderPage } from '@/helpers/loaderPage'
import RedirectInfo from '@/components/RedirectInfo.vue'

export default {
  components: { NotifyModal, RedirectInfo },
  data() {
    return {
      deliveryId: localStorage.getItem('deliveryId'),
      visibleRedirectInfo: false,
      redirectInfoProps: {},
      client: {
        name: '',
        phone: '',
        address: '',
      },

      manager: {},
      supervisor: {},
    }
  },

  methods: {
    ...mapMutations([
      'setAppError',
      'setManagementHideHeader',
      'setManagementActiveTab',
    ]),
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
    async getManager(deliveryId) {
      try {
        const URL = `${process.env.VUE_APP_API_DELIVERY}/extra-manager/${deliveryId}`

        let res = await fetch(URL),
          response = await res.json()
        if (response.error) throw response
        return response
      } catch (error) {
        let message =
          error.statusText ||
          `Error de Front: Al obtener manager de entrega` + error
        this.setAppError(message)
      }
    },
    async getSupervisor(deliveryId) {
      try {
        const URL = `${process.env.VUE_APP_API_DELIVERY}/extra-supervisor/${deliveryId}`

        let res = await fetch(URL),
          response = await res.json()
        if (response.error) throw response
        return response
      } catch (error) {
        let message =
          error.statusText ||
          `Error de Front: Al obtener supervisor de entrega` + error
        this.setAppError(message)
      }
    },
  },
  async mounted() {
    let loader = loaderPage(this.$loading) //Loader desde validar
    this.setManagementHideHeader(false)
    this.setManagementActiveTab('informacion')
    let { validate, pageToReturn } = await validateInfoPage()
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
    loader.hide()

    let loaderManager = loaderPage(this.$loading, '.manager', {
      backgroundColor: '#ececec',
    })
    let loaderSupervisor = loaderPage(this.$loading, '.supervisor', {
      backgroundColor: '#ececec',
    })

    //getClient
    let responseClient = await this.getClient(this.deliveryId)
    if (typeof responseClient === 'undefined') return

    if (responseClient.status == 'success') {
      this.client = responseClient.data.client
    }
    if (responseClient.status == 'fail') {
      alert('DeliveryId desconocido')
    }

    if (process.env.NODE_ENV == 'production') {
      //getManager
      let responseManager = await this.getManager(this.deliveryId)
      if (typeof responseManager == 'undefined') return

      if (responseManager.status == 'success') {
        this.manager = responseManager.data.manager
        loaderManager.hide()
      }

      if (responseManager.status == 'fail') {
        this.manager = { cod: '×', name: '×', phone: '×' }
        loaderManager.hide()
      }

      //getSupervisor
      let responseSupervisor = await this.getSupervisor(this.deliveryId)
      if (typeof responseSupervisor == 'undefined') return

      if (responseSupervisor.status == 'success') {
        this.supervisor = responseSupervisor.data.manager
        loaderSupervisor.hide()
      }

      if (responseManager.status == 'fail') {
        this.supervisor = { name: '×', phone: '×' }
        loaderSupervisor.hide()
      }
    }
  },
}
</script>

<style scoped>
.contacts .call {
  margin-right: 20px !important;
}

.call i,
.notify i,
.chat i,
.map i {
  margin-right: 5px;
}

.contacts,
.map {
  cursor: pointer;
}

.mapa a {
  text-decoration: none;
}

.disabled a {
  opacity: 0.3;
  pointer-events: none;
}

.extra {
  background-color: #ececec;
}

.container {
  overflow-y: auto;
  height: 92vh;
}
</style>
