<template>
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
          <SpinnerButton
            @click="manage"
            data-dismiss="modal"
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
import { actualDateTime } from '@/helpers/date'
import { mapMutations } from 'vuex'
import SpinnerButton from '../SpinnerButton.vue'
export default {
  components: { SpinnerButton },
  data() {
    return {
      loadingSpinner: false,
      deliveryId: localStorage.getItem('deliveryId'),
    }
  },
  methods: {
    ...mapMutations(['setAppError']),
    async updateDeliveryDetail(deliveryId) {
      try {
        const URL = `${process.env.VUE_APP_API_DELIVERY}/detail/${deliveryId}`
        let res = await fetch(URL, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              section: 'itemsManaged',
              data: {
                date: actualDateTime(),
              },
            }),
          }),
          response = await res.json()
        if (response.error) throw response

        return response
      } catch (error) {
        let message =
          error.statusText || `Error de Front: Al gestionar pedidos` + error
        this.setAppError(message)
      }
    },

    async manage() {
      this.loadingSpinner = true
      let response = await this.updateDeliveryDetail(this.deliveryId)

      if (typeof response === 'undefined') return

      if (response.status == 'success') {
        this.loadingSpinner = false
        this.$router.push({ name: `handle` })
      }
      if (response.status == 'fail') {
        alert('No se pudo gestionar los pedidos')
      }
    },
  },
}
</script>
