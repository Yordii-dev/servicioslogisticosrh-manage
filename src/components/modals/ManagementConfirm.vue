<template>
  <div
    class="modal fade"
    id="modalConfirmarGestion"
    tabindex="-1"
    role="dialog"
    aria-labelledby="exampleModalCenterTitle"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-body">
          <h5 class="">¿Desea confirmar esta entrega?</h5>
          <span>Esto implica ya no volver a gestionar esta entrega</span>
        </div>
        <div class="modal-footer d-flex justify-content-evenly">
          <button
            type="button"
            class="btn btn-primary btn-sm rounded text-white"
            @click.once="manage"
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
import { mapState } from "vuex"
export default {
  data() {
    return {
      spinnerButton: false,
      managementDate: this.actualDate(),
      deliveryId: localStorage.getItem("deliveryId"),
    }
  },
  computed: {
    ...mapState(["status", "subStatus"]),
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
    async putDeliveryDetails() {
      try {
        let subStatus =
          this.subStatus == "Seleccionar sub estado" ? null : this.subStatus

        const URL = `${process.env.VUE_APP_API}/deliveryDetails/${this.deliveryId}`
        let res = await fetch(URL, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("token_user"),
            },
            body: JSON.stringify({
              section: "managed",
              data: {
                status: this.status,
                subStatus,
                fecha: this.managementDate,
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
      let managed = await this.putDeliveryDetails()

      if (typeof managed === "undefined") return
      if (managed !== null) {
        this.$router.push({ name: "deliveries" })
        console.log(managed)
        /*  if (managed.affectedRows >= 1) {
          let idDelivery = Number(this.idDelivery)
          let deliveries = JSON.parse(localStorage.getItem("deliveries"))

          for (const delivery of deliveries) {
            if (delivery.id == idDelivery) {
              let status = this.$store.state.status
              delivery.gestion = status
              break
            }
          }
          localStorage.setItem("deliveries", JSON.stringify(deliveries))
          this.$router.push({ name: `deliveries` })
        } */
      }

      this.spinnerButton = false
    },
  },
}
</script>
