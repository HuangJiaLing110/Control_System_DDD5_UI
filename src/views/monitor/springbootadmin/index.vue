<template>
  <div class="ele-body">
    <iframe :src="src" frameborder="no" style="width:100%;height: 150vh" scrolling="hidden"/>
  </div>auto
</template>
<script>
  export default {
    name: "SpringbootAdmin",
    data() {
      return {
        src: process.env.VUE_APP_API_SPRINGBOOTADMIN_URL
      }
    }
  }
</script>
<style scoped>

</style>
