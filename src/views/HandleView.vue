<template>
  <div class="container-handle">
    <RedirectInfo
      v-show="visibleRedirectInfo"
      :tittle="redirectInfoProps.tittle"
      :detail="redirectInfoProps.detail"
      :pageToReturn="redirectInfoProps.pageToReturn"
    />
    <div class="user">
      <div class="destinatario">
        <div
          class="mb-3 d-flex justify-content-between align-items-center w-75"
        >
          <router-link class="" :to="{ name: 'deliveries' }">
            <i class="fa fa-arrow-left" aria-hidden="true"></i>
          </router-link>

          <p class="mx-2 m-0">Destinatario</p>
          <span class="destinatario-code text-secondary">
            {{ client.id }}
          </span>
        </div>
        <span class="h6 destinatario-name">{{ client.name }}</span>
      </div>
    </div>
    <ManagementStatus></ManagementStatus>

    <!-- Items -->
    <router-link
      :class="{ disabled: ordersManaged }"
      class="nav-link p-0"
      :to="{ name: 'orders' }"
    >
      <div class="items">
        <div class="item">
          <p class="h6">Items</p>
          <span>{{ totalOrders }} bultos</span>
        </div>
        <i
          :class="{
            'fa-solid fa-chevron-right text-success': !ordersManaged,
            'fa-circle-check text-success fa-solid': ordersManaged,
          }"
        >
        </i>
      </div>
    </router-link>

    <!-- Form -->
    <router-link
      :class="{
        disabled: !ACCESS_FORM[subStatus] || evidenced,
      }"
      class="nav-link p-0"
      :to="{ name: 'evidence' }"
    >
      <div class="evidencia">
        <h6>
          {{
            evidenced
              ? 'Evidencia enviada'
              : ACCESS_FORM[subStatus]
              ? 'Enviar evidencia'
              : 'Enviar evidencia [No disponible]'
          }}
        </h6>

        <i
          :class="
            evidenced
              ? 'fa-circle-check text-success fa-solid'
              : ACCESS_FORM[subStatus]
              ? 'fa-solid fa-chevron-right text-success'
              : 'fa-solid fa-ban'
          "
        ></i>
      </div>
    </router-link>

    <!-- Boton Confirmar-->
    <button
      class="btnConfirmar"
      data-toggle="modal"
      data-target="#modalConfirmarGestion"
      :style="{ 'background-color': COLOR[status] }"
      :class="{
        btnDisabled:
          SUB_STATUS[status].length != 0 &&
          subStatus == 'Seleccionar sub estado',
      }"
    >
      <h5 class="my-0">Confirmar gestion</h5>
      <i class="fa-solid fa-check-double"></i>
    </button>

    <ManagementConfirmModal></ManagementConfirmModal>
  </div>
</template>
<script>
import { mapMutations, mapState } from 'vuex'
import ManagementConfirmModal from '../components/modals/ManagementConfirmModal.vue'
import ManagementStatus from '../components/ManagementStatus.vue'
import RedirectInfo from '@/components/RedirectInfo.vue'
import { validateHandlePage } from '../validations/validateHandlePage'
import { loaderPage } from '@/helpers/loaderPage'

export default {
  components: { ManagementConfirmModal, ManagementStatus, RedirectInfo },
  data() {
    return {
      deliveryId: localStorage.getItem('deliveryId'),
      visibleRedirectInfo: false,
      redirectInfoProps: {},
      ordersManaged: true,
      evidenced: true,

      client: {
        id: '...',
        name: '...',
      },
      totalOrders: '...',
    }
  },
  computed: {
    ...mapState(['management']),
    COLOR() {
      return this.management.COLOR
    },
    ACCESS_FORM() {
      return this.management.ACCESS_FORM
    },
    SUB_STATUS() {
      return this.management.SUB_STATUS
    },
    status() {
      return this.management.status
    },
    subStatus() {
      return this.management.subStatus
    },
  },
  methods: {
    ...mapMutations([
      'setAppError',
      'setManagementActiveTab',
      'setManagementHideHeader',
    ]),
    async getDeliveryDetail(deliveryId) {
      try {
        const URL = `${process.env.VUE_APP_API_DELIVERY}/detail/${deliveryId}`

        let res = await fetch(URL),
          response = await res.json()
        if (response.error) throw response
        return response
      } catch (error) {
        let message =
          error.statusText ||
          `Error de Front: Al obtener detalle de entrega` + error
        this.setAppError(message)
      }
    },
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
    async getTotalOrders(deliveryId) {
      try {
        const URL = `${process.env.VUE_APP_API_DELIVERY}/orders-total/${deliveryId}`

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
  },
  async mounted() {
    let loader = loaderPage(this.$loading) //Loader desde validar
    this.setManagementHideHeader(false)
    this.setManagementActiveTab('gestion')
    let { validate, pageToReturn } = await validateHandlePage()
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

    let responseDetail = await this.getDeliveryDetail(this.deliveryId)

    if (typeof responseDetail == 'undefined') return
    if (responseDetail.status == 'success') {
      this.ordersManaged = responseDetail.data.detail.ordersManaged
      this.evidenced = responseDetail.data.detail.evidenced
    }

    //getClient
    let responseClient = await this.getClient(this.deliveryId)
    if (typeof responseClient == 'undefined') return
    if (responseClient.status == 'success') {
      this.client = responseClient.data.client
    }

    //getTotalOrders
    let responseTotalOrders = await this.getTotalOrders(this.deliveryId)
    if (typeof responseTotalOrders == 'undefined') return
    if (responseTotalOrders.status == 'success') {
      this.totalOrders = responseTotalOrders.data.total
    }

    loader.hide()
  },
}
</script>

<style scoped>
.container-management .user {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
}

.container-management .user i {
  font-size: 20px;
}

.items,
.evidencia {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 20px;

  border-bottom: 1px solid rgb(172, 172, 172);
  cursor: pointer;
}

.btnConfirmar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: #007bff;
  border: none;
  color: white;

  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
}
.btnConfirmar i {
  font-size: 20px;
}

.content p {
  cursor: pointer;
}

.btnDisabled {
  pointer-events: none;
  opacity: 0.5;
}
</style>
