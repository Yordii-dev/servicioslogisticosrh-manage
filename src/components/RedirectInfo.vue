<template>
  <div
    v-if="pageToReturn"
    class="container-info-modal position-absolute bg-secondary"
  >
    <div class="info w-75 bg-white p-3 mx-auto position-relative rounded">
      <h6>{{ tittle }}</h6>
      <small>{{ detail }}</small>
      <div class="d-flex flex-column mt-3">
        <router-link
          class="btn btn-sm align-self-end"
          :to="{ name: pageToReturn.name, params: pageToReturn.params }"
        >
          ACEPTAR
        </router-link>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    tittle: String,
    detail: String,
    pageToReturn: Object,
  },
}
</script>

<style scoped>
.container-info-modal {
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: 10000;
  opacity: 0.98;
}

.info {
  margin-top: 250px;
  z-index: -10000;
}
</style>
