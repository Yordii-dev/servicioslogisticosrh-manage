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
          <p data-dismiss="modal" @click="setStatus('En Ruta')">En Ruta</p>
          <p data-dismiss="modal" @click="setStatus('Entregado')">Entregado</p>
          <p data-dismiss="modal" @click="setStatus('No Entregado')">
            No Entregado
          </p>
          <p data-dismiss="modal" @click="setStatus('Entrega Parcial')">
            Entrega Parcial
          </p>
          <p
            data-dismiss="modal"
            @click="setStatus('Devoluciones Programadas')"
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
import { mapMutations } from "vuex"
export default {
  methods: {
    ...mapMutations(["setStatus"]),
  },
}
</script>
