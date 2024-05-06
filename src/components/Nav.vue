<template>
  <nav v-if="!$store.state.hideNav">
    <ul>
      <li
        @click="whoBorder = 'g'"
        class="h6"
        :class="{ 'border-bottom': whoBorder == 'g' }"
      >
        <router-link @click="whoBorder = 'g'" :to="{ name: 'handle' }"
          >GESTION</router-link
        >
      </li>
      <li
        @click="whoBorder = 'i'"
        class="h6"
        :class="{ 'border-bottom': whoBorder == 'i' }"
      >
        <router-link @click="whoBorder = 'i'" :to="{ name: 'info' }"
          >INFORMACION</router-link
        >
      </li>
    </ul>
  </nav>
</template>
<script>
export default {
  name: "NavManagement",
  data() {
    return {
      whoBorder: "g",
    }
  },

  methods: {
    /*  selection(e) {
      if (e.target.matches("a")) {
        let li = e.target.parentNode
        if (li.id == "gestion") {
          li.style.borderBottom = "3px solid rgb(27, 209, 155)"
          const infor = document.getElementById("informacion")
          infor.style.borderBottom = "none"
        }
        if (li.id == "informacion") {
          li.style.borderBottom = "3px solid rgb(27, 209, 155)"
          const gestion = document.getElementById("gestion")
          gestion.style.borderBottom = "none"
        }
      }
    }, */
  },
}
</script>
<style scoped>
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
