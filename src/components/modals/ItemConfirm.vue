<template>
  <!-- Modal Confirmar Gestion-->
  <div
    class="modal fade"
    id="modalConfirmarGestionItems"
    tabindex="-1"
    role="dialog"
    aria-labelledby="exampleModalCenterTitle"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-body">
          <h5 class="">¿Desea finalizar la gestion de items?</h5>
          <span>Esto implica ya no volver a gestionarlos luego</span>
        </div>
        <div class="modal-footer d-flex justify-content-evenly">
          <button
            class="btn btn-primary btn-sm rounded text-white"
            @click="manage"
            data-dismiss="modal"
          >
            <span
              class="spinner-border spinner-border-sm mx-1"
              :class="spinnerButton ? '' : 'd-none'"
              role="status"
              aria-hidden="true"
            ></span>

            Confirmar
          </button>

          <button
            type="button"
            class="btn btn-secondary btn-sm"
            data-dismiss="modal"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      spinnerButton: false,
      fecha: this.actualDate(),
      deliveryId: localStorage.getItem("deliveryId"),
    }
  },
  methods: {
    actualDate() {
      const now = new Date()
      const offsetMs = now.getTimezoneOffset() * 60 * 1000
      const dateLocal = new Date(now.getTime() - offsetMs)
      const str = dateLocal
        .toISOString()
        .slice(0, 19)
        .replace(/-/g, "-")
        .replace("T", " ")

      return str
    },
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
    validateManaged(managed) {
      if (managed) {
        this.$router.push({ name: "deliveries" })
      }
    },
    validateItemsManaged(itemsManaged) {
      if (itemsManaged) {
        this.$router.push({ name: "handle" })
      }
    },
    async putDeliveryDetails() {
      try {
        const URL = `${process.env.VUE_APP_API}/deliveryDetails/${this.deliveryId}`
        let res = await fetch(URL, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("token_user"),
            },
            body: JSON.stringify({
              section: "itemsManaged",
              data: {
                fecha: this.fecha,
                idEntrega: this.deliveryId,
              },
            }),
          }),
          json = await res.json()
        return json
      } catch (error) {
        this.$emit("error", error)
      }
    },

    async manage() {
      this.spinnerButton = true
      let managedItems = await this.putDeliveryDetails()

      if (typeof managedItems === "undefined") return

      if (managedItems !== null) {
        this.$router.push({ name: `handle` })
      }
      this.spinnerButton = false
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

    const deliveryDetails = await this.getDeliveryDetails()
    if (typeof deliveryDetails === "undefined") return

    if (deliveryDetails !== null) {
      this.validateManaged(deliveryDetails.managed)
      this.validateItemsManaged(deliveryDetails.itemsManaged)

      loader.hide()
    } else {
      alert("DeliveryId desconocido")
      console.log("DeliveryId desconocido")
    }
  },
}
</script>
<style scoped>
/* .btn-ingresar {
  background: #142c8e;
  font-size: 20px;
  border-radius: 20px;
} */
</style>
