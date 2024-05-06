<template>
  <div
    class="item mb-4"
    data-toggle="modal"
    data-target="#modifyModal"
    @click="
      setDatatItem({
        id: item.id,
        given: item.given,
        ordered: item.ordered,
      })
    "
  >
    <div>
      <p class="name">{{ item.name }}</p>
      <p class="code mt-2">{{ item.id }}</p>
    </div>
    <p class="digit">
      <span :class="{ 'text-success h6': item.given > 0 }">
        {{ item.given }} </span
      >/{{ item.ordered }}
    </p>
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex"
export default {
  name: "ItemDelivery",
  props: ["item"],
  computed: {
    ...mapState(["datatItem"]),
  },
  methods: {
    ...mapMutations(["setDatatItem"]),
  },
}
</script>

<style scoped>
.item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgb(209, 209, 209);
  cursor: pointer;
  font-size: 13px;
}

.item div .code {
  font-weight: bold;
}
</style>
