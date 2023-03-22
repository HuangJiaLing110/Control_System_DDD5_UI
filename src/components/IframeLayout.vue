<!-- iframe布局 license by http://eleadmin.com -->
<template>
  <iframe :src="url" frameborder="0" class="ele-admin-iframe"></iframe>
</template>

<script>
  import {formatUrl} from "@/config/app";

  export default {
    name: 'IframeLayout',
    data() {
      const meta = this.$route.meta;
      return {
        url: meta ? formatUrl(meta.url) : null
      };
    },
    watch: {
      $route() {
        const meta = this.$route.meta;
        this.url = meta ? formatUrl(meta.url): null;
      }
    }
  }
</script>
