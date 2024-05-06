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
          <SpinnerButton
            data-dismiss="modal"
            @click="manage"
            classes="btn-sm rounded"
            :loading="loadingSpinner"
            text="Confirmar"
            textLoading="Confirmando"
          />
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
import SpinnerButton from '../SpinnerButton.vue'
import { actualDateTime } from '@/helpers/date'
import { mapMutations, mapState } from 'vuex'
export default {
  components: { SpinnerButton },
  data() {
    return {
      loadingSpinner: false,
      deliveryId: localStorage.getItem('deliveryId'),
    }
  },
  computed: {
    ...mapState(['management']),
  },
  methods: {
    ...mapMutations(['setAppError']),
    async updateDeliveryDetail(deliveryId) {
      try {
        let subStatus =
          this.management.subStatus == 'Seleccionar sub estado'
            ? null
            : this.management.subStatus

        const URL = `${process.env.VUE_APP_API_DELIVERY}/detail/${deliveryId}`
        let res = await fetch(URL, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              section: 'managed',
              data: {
                status: this.management.status,
                subStatus,
                date: actualDateTime(),
              },
            }),
          }),
          response = await res.json()
        if (response.error) throw response

        return response
      } catch (error) {
        let message =
          error.statusText || `Error de Front: Al gestionar entrega` + error
        this.setAppError(message)
      }
    },

    async manage() {
      this.loadingSpinner = true
      let response = await this.updateDeliveryDetail(this.deliveryId)

      if (typeof response == 'undefined') return

      if (response.status == 'success') {
        this.loadingSpinner = false
        this.$router.push({ name: 'deliveries' })
      }

      if (response.status == 'fail') {
        alert('No se pudo gestionar la entrega')
      }
    },
  },
}
</script>
