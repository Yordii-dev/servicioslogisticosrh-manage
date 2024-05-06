<template>
  <div
    class="container-status"
    :style="{ 'background-color': $store.state.COLOR[$store.state.status] }"
  >
    <!-- Boton status -->

    <input
      class="btn btn-status text-left"
      type="text"
      v-model="$store.state.status"
      readonly
      data-toggle="modal"
      data-target="#modalStatus"
    />

    <!-- Boton sub status -->

    <input
      class="btn btn-status text-left"
      type="text"
      v-model="$store.state.subStatus"
      :class="
        $store.state.SUB_STATUS[$store.state.status].length == 0
          ? 'subDisabled'
          : ''
      "
      readonly
      data-toggle="modal"
      data-target="#modalSubStatus"
    />
    <StatusModal></StatusModal>
    <SubStatusModal
      :status="$store.state.SUB_STATUS[$store.state.status]"
    ></SubStatusModal>
  </div>
</template>
<script>
import StatusModal from "../components/modals/StatusModal.vue"
import SubStatusModal from "../components/modals/SubStatusModal.vue"
export default {
  components: { StatusModal, SubStatusModal },
  data() {
    return {}
  },
}
</script>

<style scoped>
.container-status {
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  padding: 20px;
  margin-top: 10px !important;
  margin: auto;

  height: 150px;
}
.container-status .btn-status,
.container-status .btn-SubStatus {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  color: white;
  background-color: transparent;
  border: none;
  user-select: none;
  font-size: 18px;
  font-weight: 600;
}
.subDisabled {
  opacity: 0.5;
  pointer-events: none;
}
</style>
