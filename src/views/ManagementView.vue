<template>
  <div class="container-management">
    <nav v-if="!management.hideHeader">
      <ul>
        <li
          class="h6"
          :class="{ 'border-bottom': management.activeTab == 'gestion' }"
        >
          <router-link :to="{ name: 'handle' }">GESTION</router-link>
        </li>
        <li
          class="h6"
          :class="{ 'border-bottom': management.activeTab == 'informacion' }"
        >
          <router-link :to="{ name: 'info' }">INFORMACION</router-link>
        </li>
      </ul>
    </nav>
    <router-view />
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState(['management']),
  },
}
</script>
<style scoped>
.container-management {
  position: relative;
  background-color: rgb(242, 242, 242);
  height: 100vh;
}
nav ul {
  margin: 0;
  padding: 0;
  list-style: none;
  color: white;
  background-color: #ffc300;
  font-size: 20px;

  display: flex;
  justify-content: space-between;

  height: 50px;
  width: 100%;
}
nav ul li {
  height: 100% !important;
  flex-grow: 1;
  flex-basis: 50%;

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;
}
nav ul li a {
  color: white;
  text-decoration: none;
}

nav ul li a:hover {
  color: white;
}

.border-bottom {
  border-bottom: 3px solid rgb(27, 209, 155) !important;
}
</style>
