<template>
  <div
    class="noData h-100 py-5 alert-warning d-flex flex-column align-items-center justify-content-center"
  >
    <i class="fas fa-exclamation-triangle mr-2 mb-4"></i>
    <p class="h5">{{ text }}</p>
  </div>
</template>
<script>
export default {
  props: { text: String },
}
</script>

<style scoped>
.noData i {
  font-size: 70px;
}
.noData {
  height: 90vh;
}
</style>
