<template>
  <div class="zIndex fixed-bottom alert-danger w-100 py-3 text-center">
    {{ errorMessage }}
  </div>
</template>

<script>
export default {
  props: {
    errorMessage: String,
  },
}
</script>
<style scoped>
.zIndex {
  z-index: 10000;
}
</style>
