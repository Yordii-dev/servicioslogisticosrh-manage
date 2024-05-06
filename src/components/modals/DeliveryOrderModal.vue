<template>
  <!-- Modal Modify item-->
  <div
    class="modal fade"
    id="modifyModal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="exampleModalCenterTitle"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-body">
          <div class="code">
            <span>Cód: {{ orders.orderData.itemId }}</span>
          </div>
          <div class="modify">
            <p class="h6">Entregados</p>
            <div class="quantity">
              <i class="fa-solid fa-circle-minus" @click="decrementGiven"></i>
              <div class="num">
                <span>{{ orders.orderData.given }} </span>
                <small>de {{ orders.orderData.amount }}</small>
              </div>
              <i class="fa-solid fa-circle-plus" @click="incrementGiven"></i>
            </div>
          </div>
        </div>
        <div class="d-flex w-100 justify-content-around">
          <button type="button" class="btn" data-dismiss="modal">Cerrar</button>

          <SpinnerButton
            classes="btn-light"
            data-dismiss="modal"
            @click="deliveryOrder"
            :loading="loadingSpinner"
            text="Entregar"
            textLoading="Entregando"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
import SpinnerButton from '../SpinnerButton.vue'
export default {
  components: { SpinnerButton },
  data() {
    return {
      loadingSpinner: false,
    }
  },

  computed: {
    ...mapState(['orders']),
  },
  methods: {
    ...mapMutations(['setAppError', 'decrementGiven', 'incrementGiven']),

    async createDelivered() {
      try {
        const URL = `${process.env.VUE_APP_API_DELIVERY}/delivered-order`
        let res = await fetch(URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              amount: this.orders.orderData.given,
              orderId: this.orders.orderData.id,
            }),
          }),
          response = await res.json()

        if (response.error) throw response
        return response
      } catch (error) {
        let message =
          error.statusText || `Error de Front: Al entregar pedido` + error
        this.setAppError(message)
      }
    },
    async deliveryOrder() {
      if (this.orders.orderData.given <= 0) return

      this.loadingSpinner = true
      let response = await this.createDelivered()

      if (typeof response === 'undefined') return
      if (response.status == 'success') {
        this.loadingSpinner = false
        location.reload()
      }
    },
  },
}
</script>
<style scoped>
.quantity .digit {
  color: rgb(31, 5, 102);
  font-weight: bold;
}

.modify {
  background-color: #d0d7df;
}

.modify > p {
  padding-top: 8px;
  margin: 10px !important;
}

.quantity {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
.quantity i {
  color: #498095;
  cursor: pointer;
  font-size: 40px;
}

.num {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: white;
  flex-grow: 0.25;
  height: 80px;
  margin-bottom: 10px;
}

.num span:nth-child(1) {
  color: #498095;
  font-size: 30px;
}
</style>
