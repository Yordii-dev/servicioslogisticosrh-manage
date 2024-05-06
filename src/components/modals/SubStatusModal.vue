<template>
  <div
    class="modal fade"
    id="modalSubStatus"
    tabindex="-1"
    role="dialog"
    aria-labelledby="exampleModalCenterTitle"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-body content">
          <p
            v-for="value in status"
            :key="value"
            data-dismiss="modal"
            @click="setManagementSubStatus(value)"
          >
            {{ value }}
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
  props: ['status'],
  methods: {
    ...mapMutations(['setManagementSubStatus']),
  },
}
</script>
