<template>
  <div
    :class="{ disabled: deliveryStatus }"
    class="user"
    @click="goHandle(deliveryId)"
  >
    <div class="code">
      <i
        :class="deliveryStatus ? 'fa-solid' : 'fa-regular'"
        class="fa-circle-check text-success"
      ></i>
      <div class="d-flex justify-content-between align-items-center w-100">
        <p>{{ deliveryId }}</p>
        <SpinnerText
          :loading="loadingSpinner"
          :text="price"
          textLoading="Cargando precio"
          classes="text-secondary"
          :style="{
            'font-size': '12px',
          }"
        />
      </div>
    </div>

    <div class="direction my-2">
      <i class="fa-solid fa-location-dot"></i>
      <p class="text-truncate w-75">{{ client.address }}</p>
    </div>

    <div class="name">
      <i class="fa-solid fa-user"></i>
      <p class="text-truncate w-75">{{ client.name }}</p>
    </div>
    <div class="time d-flex flex-column mt-1">
      <small class="text-secondary align-self-end">{{ deliveryCt }} </small>
    </div>
  </div>
</template>
<script>
import { mapMutations } from 'vuex'
import SpinnerText from '../components/SpinnerText.vue'

export default {
  name: 'deliveryComponent',
  components: { SpinnerText },
  props: {
    deliveryId: String,
    deliveryStatus: String,
    deliveryCt: String,
    client: Object,
  },
  data() {
    return {
      loadingSpinner: true,
      isManaged: true,
      price: '',
    }
  },
  methods: {
    ...mapMutations(['setManagementStatus', 'setAppError']),

    async getPrice(deliveryId) {
      try {
        const URL = `${process.env.VUE_APP_API_DELIVERY}/extra-price/${deliveryId}`

        let res = await fetch(URL),
          response = await res.json()
        if (response.error) throw response
        return response
      } catch (error) {
        let message =
          error.statusText ||
          `Error de Front: Al obtener precio de entrega` + error
        this.setAppError(message)
      }
    },
    goHandle(deliveryId) {
      this.setManagementStatus('En Ruta')
      localStorage.setItem('deliveryId', deliveryId)
      this.$router.push({ name: 'handle' })
    },
  },

  async mounted() {
    if (process.env.NODE_ENV == 'production') {
      //getPrice
      let responsePrice = await this.getPrice(this.deliveryId)

      if (typeof responsePrice == 'undefined') return
      if (responsePrice.status == 'success') {
        this.price = 's/. ' + responsePrice.data.price
        this.loadingSpinner = false
      }
      if (responsePrice.status == 'fail') {
        this.price = 'x'
      }
    }
  },
}
</script>
<style scoped>
p {
  margin: 0 !important;
  padding: 0 !important;
}

.user {
  padding: 15px;
  padding-bottom: 0px;
  color: rgb(104, 104, 104);
  cursor: pointer;
  border-bottom: rgb(211, 211, 211) 1px solid;
}
.user i {
  font-size: 15px;
}
.user p {
  font-size: 15px;
  margin-left: 10px !important;
}

.name p,
.direction p {
  font-size: 15px;
}

.code,
.direction,
.name {
  display: flex;
  display: flex;
  align-items: center;
}

.direction,
.name {
  margin-left: 25px;
}

.code p {
  color: #e1b501;
  font-weight: bold;
}

.disabled {
  opacity: 0.4;
  cursor: n;
  pointer-events: none;
}
</style>
