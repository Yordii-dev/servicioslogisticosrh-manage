<template>
  <router-view />
  <ErrorFetch v-show="appError.length > 0" :errorMessage="appError" />
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import ErrorFetch from './components/chunks/ErrorFetch.vue'
export default {
  data() {
    return {}
  },
  components: { ErrorFetch },
  computed: {
    ...mapState(['appError']),
  },
  methods: {
    ...mapMutations(['setAppError']),
  },
  mounted() {
    //Borro todo error visible al actualizar, de lo contrario vuex lo visualizara
    this.setAppError('')
  },
}
</script>

<style></style>
