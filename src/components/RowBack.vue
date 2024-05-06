<template>
  <div class="py-2">
    <router-link class="h3 mx-2" :to="{ name: pageName, params }">
      <i class="fa fa-arrow-left" aria-hidden="true"></i>
    </router-link>
  </div>
</template>

<script>
export default {
  props: ['pageName', 'params'],
}
</script>
