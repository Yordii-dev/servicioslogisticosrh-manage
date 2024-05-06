<template>
  <div
    class="modal fade"
    id="evidenceConfirmModal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="exampleModalCenterTitle"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-body">
          <h5 class="">¿Desea enviar la evidencia?</h5>
          <span>Esto implica ya no volver a enviarla luego</span>
        </div>
        <div class="modal-footer d-flex justify-content-evenly">
          <SpinnerButton
            @click="handleClick"
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
import { mapMutations, mapState } from 'vuex'
import SpinnerButton from '../SpinnerButton.vue'
export default {
  components: { SpinnerButton },
  data() {
    return {
      loadingSpinner: false,
      deliveryId: localStorage.getItem('deliveryId'),
    }
  },
  computed: {
    ...mapState(['evidence']),
  },
  methods: {
    ...mapMutations(['setAppError']),
    async createEvidence() {
      try {
        const URL = `${process.env.VUE_APP_API_DELIVERY}/evidence`

        let fData = new FormData()
        fData.append('image', this.evidence.image)
        fData.append('comment', this.evidence.comment)
        fData.append('deliveryId', this.deliveryId)
        fData.append('date', actualDateTime())

        let res = await fetch(URL, {
            method: 'POST',
            body: fData,
          }),
          response = await res.json()
        if (response.error) throw response
        return response
      } catch (error) {
        let message =
          error.statusText ||
          `Error de Front: Al crear evidencia de entrega` + error
        this.setAppError(message)
      }
    },
    async handleClick() {
      this.loadingSpinner = true
      let response = await this.createEvidence()
      if (typeof response == 'undefined') return

      if (response.status == 'success') {
        this.loadingSpinner = false
        this.$router.push({ name: `handle` })
      }
    },
  },
}
</script>
