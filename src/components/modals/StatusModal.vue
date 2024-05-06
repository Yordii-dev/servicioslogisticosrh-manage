<template>
  <div
    class="modal fade"
    id="modalStatus"
    tabindex="-1"
    role="dialog"
    aria-labelledby="exampleModalCenterTitle"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-body content">
          <p data-dismiss="modal" @click="setManagementStatus('En Ruta')">
            En Ruta
          </p>
          <p data-dismiss="modal" @click="setManagementStatus('Entregado')">
            Entregado
          </p>
          <p data-dismiss="modal" @click="setManagementStatus('No Entregado')">
            No Entregado
          </p>
          <p
            data-dismiss="modal"
            @click="setManagementStatus('Entrega Parcial')"
          >
            Entrega Parcial
          </p>
          <p
            data-dismiss="modal"
            @click="setManagementStatus('Devoluciones Programadas')"
          >
            Devoluciones Programadas
          </p>
        </div>
        <div class="text-center">
          <button type="button" class="btn" data-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapMutations } from 'vuex'
export default {
  methods: {
    ...mapMutations(['setManagementStatus']),
  },
}
</script>
