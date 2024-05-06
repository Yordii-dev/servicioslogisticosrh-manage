<template>
  <div
    :class="{ disabled: delivery.managed }"
    class="user"
    @click="href(delivery.idDelivery)"
  >
    <div class="code">
      <i
        :class="delivery.managed ? 'fa-solid' : 'fa-regular'"
        class="fa-circle-check text-success"
      ></i>
      <div class="d-flex justify-content-between align-items-center w-100">
        <p>{{ delivery.idDelivery }}</p>
        <small class="price text-secondary"
          >s/.{{ delivery.price == 0 ? "x" : delivery.price }}
        </small>
      </div>
    </div>

    <div class="direction my-2">
      <i class="fa-solid fa-location-dot"></i>
      <p>{{ delivery.client.address }}</p>
    </div>

    <div class="name">
      <i class="fa-solid fa-user"></i>
      <p>{{ delivery.client.name }}</p>
    </div>
    <div class="time d-flex flex-column mt-2">
      <small class="text-secondary align-self-end">{{
        delivery.destination_time
      }}</small>
    </div>
  </div>
</template>
<script>
export default {
  props: ["delivery"],
  name: "deliveryComponent",
  methods: {
    href(deliveryId) {
      localStorage.setItem("deliveryId", deliveryId)
      this.$router.push({ name: "handle" })
    },
  },
}
</script>
<style scoped>
p {
  margin: 0 !important;
  padding: 0 !important;
}

.user {
  padding: 20px;
  padding-bottom: 0px;
  color: rgb(104, 104, 104);
  cursor: pointer;
  border-bottom: rgb(211, 211, 211) 1px solid;
}
.user i {
  font-size: 18px;
}
.user p {
  font-size: 18px;

  margin-left: 10px !important;
}

.name p,
.direction p {
  font-size: 15px;
}

.code,
.direction,
.name {
  display: flex;
  display: flex;
  align-items: center;
}

.direction,
.name {
  margin-left: 30px;
}

.code p {
  color: #e1b501;
  font-weight: bold;
}

.disabled {
  opacity: 0.4;
  cursor: n;
  pointer-events: none;
}
</style>
