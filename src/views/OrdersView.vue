<template>
  <div class="container">
    <RedirectInfo
      v-show="visibleRedirectInfo"
      :tittle="redirectInfoProps.tittle"
      :detail="redirectInfoProps.detail"
      :pageToReturn="redirectInfoProps.pageToReturn"
    />
    <RowBack pageName="handle"></RowBack>

    <div class="orders">
      <Order v-for="order in orders" :key="order.id" :order="order"></Order>
    </div>

    <button
      v-if="VIEW_BUTTON_ITEM[management.status]"
      data-toggle="modal"
      data-target="#modalConfirmarGestionItems"
      class="btn-confirmar btn btn-primary w-100 flex-grow-1"
    >
      Finalizar
    </button>
    <DeliveryOrderModal v-if="ACCESS_MODAL[management.status]" />
    <OrdersConfirmModal />
  </div>
</template>

<script>
import RowBack from '@/components/RowBack.vue'
import Order from '@/components/Order.vue'
import DeliveryOrderModal from '../components/modals/DeliveryOrderModal.vue'
import OrdersConfirmModal from '../components/modals/OrdersConfirmModal.vue'
import RedirectInfo from '@/components/RedirectInfo.vue'
import { loaderPage } from '@/helpers/loaderPage'
import { mapMutations, mapState } from 'vuex'
import { validateOrdersPage } from '../validations/validateOrdersPage'

export default {
  name: 'ManagementItems',
  components: {
    RowBack,
    Order,
    DeliveryOrderModal,
    OrdersConfirmModal,
    RedirectInfo,
  },
  data() {
    return {
      token: localStorage.getItem('token-operator'),
      deliveryId: localStorage.getItem('deliveryId'),
      visibleRedirectInfo: false,
      redirectInfoProps: {},
      orders: [],

      ACCESS_MODAL: {
        'En Ruta': false,
        Entregado: false,
        'No Entregado': false,
        'Entrega Parcial': true,
        'Devoluciones Programadas': true,
      },
      VIEW_BUTTON_ITEM: {
        'En Ruta': true,
        Entregado: false,
        'No Entregado': true,
        'Entrega Parcial': true,
        'Devoluciones Programadas': true,
      },
    }
  },
  computed: {
    ...mapState(['management']),
  },

  methods: {
    ...mapMutations(['setAppError', 'setManagementHideHeader']),
    async getOrders(deliveryId) {
      try {
        const URL = `${process.env.VUE_APP_API_DELIVERY}/orders/${deliveryId}`

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
          `Error de Front: Al obtener pedidos de entrega` + error
        this.setAppError(message)
      }
    },
  },
  async mounted() {
    let loader = loaderPage(this.$loading)
    this.setManagementHideHeader(true)

    let { validate, pageToReturn } = await validateOrdersPage()
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

    let response = await this.getOrders(this.deliveryId)
    if (typeof response === 'undefined') return

    if (response.status == 'success') {
      this.orders = response.data.orders
    }
    loader.hide()
  },
}
</script>
<style scoped>
.orders {
  padding-top: 20px;
  padding-bottom: 80px;
  padding-right: 10px;
  height: 85vh !important;
  overflow-y: auto;
}
.btn-confirmar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 10px 20px;
}
</style>
