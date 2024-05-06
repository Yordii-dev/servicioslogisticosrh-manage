<template>
  <div
    class="item mb-4"
    data-toggle="modal"
    data-target="#modifyModal"
    @click="
      setOrderData({
        id: order.id,
        itemId: order.itemId,
        given: order.given,
        amount: order.amount,
      })
    "
  >
    <div>
      <p class="name">{{ order.name }}</p>
      <p class="code mt-2">{{ order.itemId }}</p>
    </div>
    <p class="digit">
      <span :class="{ 'text-success h6': order.given > 0 }">
        {{ order.given }} </span
      >/{{ order.amount }}
    </p>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  name: 'ItemDelivery',
  props: ['order'],
  methods: {
    ...mapMutations(['setOrderData']),
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
