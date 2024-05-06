<template>
  <div>
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
      :class="{ disabled: itemsManaged }"
      class="nav-link p-0"
      :to="{ name: 'items' }"
    >
      <div class="items">
        <div class="item">
          <p class="h6">Items</p>
          <span>{{ itemsAmount }} bultos</span>
        </div>
        <i
          :class="{
            'fa-solid fa-chevron-right text-success': !itemsManaged,
            'fa-circle-check text-success fa-solid': itemsManaged,
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
      :to="{ name: 'form' }"
    >
      <div class="formulario">
        <h6>
          {{
            evidenced
              ? "Evidencia enviada"
              : ACCESS_FORM[subStatus]
              ? "Formulario disponible"
              : "Formulario no disponible"
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
      :style="{ 'background-color': COLOR[status] }"
      :class="{
        btnDisabled:
          SUB_STATUS[status].length != 0 &&
          subStatus == 'Seleccionar sub estado',
      }"
      data-target="#modalConfirmarGestion"
    >
      <h5 class="my-0">Confirmar gestion</h5>
      <i class="fa-solid fa-check-double"></i>
    </button>

    <ManagementConfirm @error="emitError"></ManagementConfirm>
    <div
      v-show="error != false"
      class="fixed-bottom alert-danger w-100 py-3 text-center"
    >
      {{ error }}
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex"
import ManagementConfirm from "../components/modals/ManagementConfirm.vue"
import ManagementStatus from "../components/ManagementStatus.vue"

export default {
  components: { ManagementConfirm, ManagementStatus },
  data() {
    return {
      deliveryId: localStorage.getItem("deliveryId"),

      managed: true,
      itemsManaged: true,
      evidenced: true,

      client: {
        id: "...",
        name: "...",
      },
      itemsAmount: "...",

      error: false,
    }
  },
  computed: {
    ...mapState(["COLOR", "ACCESS_FORM", "SUB_STATUS", "status", "subStatus"]),
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
    emitError(error) {
      this.error = `Error al confirmar gestion: ${error}`
    },
    validateManaged(managed) {
      if (managed) {
        this.$router.push({ name: "deliveries" })
      }
    },
  },
  async mounted() {
    let loader = this.$loading.show({
      // Optional parameters
      container: false,
      canCancel: false,
      color: "rgb(27, 209, 155)",
      height: "40",
      onCancel: this.onCancel,
    })

    //Show Nav
    this.$store.state.hideNav = false
    const deliveryDetails = await this.getDeliveryDetails()
    if (typeof deliveryDetails === "undefined") return

    if (deliveryDetails !== null) {
      this.managed = deliveryDetails.managed
      this.validateManaged(this.managed)

      this.itemsManaged = deliveryDetails.itemsManaged
      this.evidenced = deliveryDetails.evidenced

      this.client = deliveryDetails.client
      this.itemsAmount = deliveryDetails.itemsAmount
      loader.hide()
    } else {
      alert("DeliveryId desconocido")
      console.log("DeliveryId desconocido")
    }
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
.formulario {
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
