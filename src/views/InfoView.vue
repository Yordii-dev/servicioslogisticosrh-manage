<template>
  <div class="container">
    <div class="addressee card p-3 mb-3 mt-3">
      <span>Destinatario</span>
      <p class="h6 mt-2 mb-5">{{ addressee.name }}</p>

      <div
        class="contacts float-right align-self-end d-flex justify-content-between"
      >
        <a
          :href="'tel:+51' + addressee.phone"
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
      <p class="h6 mt-2 mb-5">{{ addressee.address }}</p>

      <div class="map text-primary align-self-end d-flex align-items-center">
        <i class="fa-solid fa-diamond-turn-right"></i>
        <a href="singleMap">Mapa</a>
      </div>
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
import NotifyModal from "../components/modals/NotifyModal.vue"
export default {
  components: { NotifyModal },
  data() {
    return {
      deliveryId: localStorage.getItem("deliveryId"),

      addressee: {
        name: "",
        phone: "",
        address: "",
      },

      manager: {},
      supervisor: {},

      error: false,
    }
  },

  methods: {
    async getDeliveryDetails() {
      try {
        const URL = `${process.env.VUE_APP_API}/deliveryDetails/${this.deliveryId}`
        let res = await fetch(URL, {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token_user"),
            },
          }),
          json = await res.json()
        return json
      } catch (error) {
        this.error = `Error al obtener detalle de entrega: ${error}`
      }
    },

    async getManager(idDelivery) {
      try {
        const URL = `${process.env.VUE_APP_API}/extraDelivery/manager/${idDelivery}`

        let res = await fetch(URL),
          json = await res.json()

        if (json.length == 0) return { cod: "×", name: "×", phone: "×" }

        return json[0]
      } catch (error) {
        this.error += `Error al obtener gestor: ${error}`
      }
    },
    async getSupervisor(idDelivery) {
      try {
        const URL = `${process.env.VUE_APP_API}/extraDelivery/supervisor/${idDelivery}`

        let res = await fetch(URL),
          json = await res.json()
        if (json.length == 0) return { name: "×", phone: "×" }

        return json[0]
      } catch (error) {
        this.error += `Error al obtener supervisor: ${error}`
      }
    },
  },
  async mounted() {
    //Show Nav
    this.$store.state.hideNav = false

    let loaderManager = this.$loading.show({
      // Optional parameters
      container: document.querySelector(".manager"),
      canCancel: false,
      backgroundColor: "#ececec",
      color: "rgb(27, 209, 155)",
      height: "25",

      onCancel: this.onCancel,
    })

    let loaderSupervisor = this.$loading.show({
      // Optional parameters
      container: document.querySelector(".supervisor"),
      canCancel: false,
      backgroundColor: "#ececec",
      color: "rgb(27, 209, 155)",
      height: "25",
      onCancel: this.onCancel,
    })
    const deliveryDetails = await this.getDeliveryDetails()
    if (typeof deliveryDetails === "undefined") return

    if (deliveryDetails !== null) {
      this.addressee = deliveryDetails.client
    } else {
      alert("DeliveryId desconocido")
      console.log("DeliveryId desconocido")
    }

    let manager = await this.getManager(this.deliveryId)
    let supervisor = await this.getSupervisor(this.deliveryId)

    if (manager) {
      this.manager = manager
      loaderManager.hide()
    }
    if (supervisor) {
      this.supervisor = supervisor

      loaderSupervisor.hide()
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
