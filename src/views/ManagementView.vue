<template>
  <div class="container-management">
    <Nav></Nav>
    <router-view />
  </div>
</template>
<script>
import Nav from "../components/Nav.vue"
export default {
  components: {
    Nav,
  },
}
</script>
<style>
.container-management {
  position: relative;
  background-color: rgb(242, 242, 242);
  height: 100vh;
}
</style>
