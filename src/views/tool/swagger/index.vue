<template>
  <div class="ele-body">
    <iframe :src="src" frameborder="no" style="width: 100%;height: 100%" scrolling="auto"/>
  </div>
</template>

<script>
export default {
  name: "Swagger",
  data() {
    return {
      src: process.env.VUE_APP_API_SWAGGER_URL
    }
  }
}
</script>

<style scoped>

</style>
