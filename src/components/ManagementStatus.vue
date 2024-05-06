<template>
  <div
    class="container-status"
    :style="{ 'background-color': management.COLOR[management.status] }"
  >
    <!-- Boton status -->

    <input
      class="btn btn-status text-left"
      type="text"
      v-model="management.status"
      readonly
      data-toggle="modal"
      data-target="#modalStatus"
    />

    <!-- Boton sub status -->

    <input
      class="btn btn-status text-left"
      type="text"
      v-model="management.subStatus"
      :class="
        management.SUB_STATUS[management.status].length == 0
          ? 'subDisabled'
          : ''
      "
      readonly
      data-toggle="modal"
      data-target="#modalSubStatus"
    />
    <StatusModal></StatusModal>
    <SubStatusModal
      :status="management.SUB_STATUS[management.status]"
    ></SubStatusModal>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import StatusModal from '../components/modals/StatusModal.vue'
import SubStatusModal from '../components/modals/SubStatusModal.vue'
export default {
  components: { StatusModal, SubStatusModal },
  computed: {
    ...mapState(['management']),
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
