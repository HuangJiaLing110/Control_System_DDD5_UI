<!-- 侧边栏菜单item license by http://eleadmin.com -->
<template>
  <template v-if="haveChildren">
    <a-sub-menu :key="item.path">
      <template #title>
        <component v-if="item.meta.icon" :is="item.meta.icon"/>
        <span>{{ item.meta.title }}</span>
      </template>
      <template v-for="child in item.children">
        <ele-pro-sidebar-item
          v-if="!child.meta.hide"
          :key="child.path"
          :item="child"/>
      </template>
    </a-sub-menu>
  </template>
  <template v-else>
    <a-menu-item :key="item.path">
      <a v-if="isUrl" :href="item.path" target="_blank">
        <component v-if="item.meta.icon" :is="item.meta.icon"/>
        <span>{{ item.meta.title }}</span>
      </a>
      <router-link v-else :to="item.path">
        <component v-if="item.meta.icon" :is="item.meta.icon"/>
        <span>{{ item.meta.title }}</span>
      </router-link>
    </a-menu-item>
  </template>
</template>

<script>
import * as antIcons from '@ant-design/icons-vue';
import util from '../../util.js';

export default {
  name: 'EleProSidebarItem',
  components: {...antIcons},
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  computed: {
    /* 是否有子级 */
    haveChildren() {
      return !!(this.item.children && this.item.children.filter((d) => !d.meta.hide).length);
    },
    /* 是否是网址 */
    isUrl() {
      return util.isUrl(this.item.path);
    }
  }
}
</script>
