<template>
  <button type="submit" class="btn btn-primary" :class="classes">
    <span
      class="spinner-border spinner-border-sm mx-1"
      :class="loading ? '' : 'd-none'"
      role="status"
      aria-hidden="true"
    ></span>

    {{ loading ? textLoading : text }}
  </button>
</template>
<script>
export default {
  props: {
    loading: Boolean,
    text: String,
    textLoading: String,
    classes: String,
  },
}
</script>
