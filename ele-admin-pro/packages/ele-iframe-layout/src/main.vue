<!-- iframe布局 license by http://eleadmin.com -->
<template>
  <iframe :src="url" frameborder="0" class="ele-admin-iframe"></iframe>
</template>

<script>
export default {
  name: 'EleIframeLayout',
  data() {
    const meta = this.$route.meta;
    return {
      url: meta ? meta.iframe : null
    };
  },
  watch: {
    $route() {
      const meta = this.$route.meta;
      this.url = meta ? meta.iframe : null;
    }
  }
}
</script>
