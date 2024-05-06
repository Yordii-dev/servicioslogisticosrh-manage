<template>
  <div class="py-2">
    <router-link class="h3 mx-2" :to="`${back}`">
      <i class="fa fa-arrow-left" aria-hidden="true"></i>
    </router-link>
  </div>
</template>

<script>
export default {
  props: ["back"],
}
</script>
