<template>
  <div class="d-flex align-items-center">
    <span
      class="spinner-border spinner-border-sm mx-1"
      :class="loading ? '' : 'd-none'"
      role="status"
      aria-hidden="true"
    ></span>
    <small :class="classes" :style="style">
      {{ loading ? textLoading : text }}
    </small>
  </div>
</template>
<script>
export default {
  props: {
    loading: Boolean,
    text: String,
    textLoading: String,
    classes: String,
    style: Object,
  },
}
</script>
