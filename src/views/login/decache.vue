

<script>
    export default {
      name: "decahe",
      mounted: function () {
        debugger
        this.$store.dispatch('user/setUser').then(() => {
        });
        this.$store.dispatch('user/setToken').then(() => {
        });
      }
    }
</script>

<style scoped>

</style>
