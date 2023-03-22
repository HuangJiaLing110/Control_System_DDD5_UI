<!-- 侧边栏双排菜单一级 license by http://eleadmin.com -->
<template>
  <div class="ele-admin-sidebar-nav ele-scrollbar-hide">
    <slot name="top"/>
    <div class="ele-admin-sidebar-nav-menu">
      <template v-for="item in data">
        <a
          v-if="isUrl(item)"
          :key="item.path"
          :href="item.path"
          target="_blank"
          :class="['ele-admin-sidebar-nav-item', {'active': active === item.path}]">
          <a-tooltip v-if="collapse" placement="right" :title="item.meta.title">
            <div class="ele-admin-sidebar-nav-tip"></div>
          </a-tooltip>
          <div class="ele-admin-sidebar-nav-icon" v-if="item.meta.icon">
            <component :is="item.meta.icon"/>
          </div>
          <div class="ele-admin-sidebar-nav-title ele-elip">{{ item.meta.title }}</div>
        </a>
        <router-link
          v-else
          :key="item.path"
          :to="item.path"
          :class="['ele-admin-sidebar-nav-item', {'active': active === item.path}]">
          <a-tooltip v-if="collapse" placement="right" :title="item.meta.title">
            <div class="ele-admin-sidebar-nav-tip"></div>
          </a-tooltip>
          <div class="ele-admin-sidebar-nav-icon" v-if="item.meta.icon">
            <component :is="item.meta.icon"/>
          </div>
          <div class="ele-admin-sidebar-nav-title ele-elip">{{ item.meta.title }}</div>
        </router-link>
      </template>
    </div>
    <slot name="bottom"/>
  </div>
</template>

<script>
import * as antIcons from '@ant-design/icons-vue';
import util from '../../util.js';

export default {
  name: 'EleProSidebarNav',
  components: {...antIcons},
  props: {
    // 菜单数据
    data: Array,
    // 菜单选中
    active: String,
    // 是否折叠
    collapse: Boolean
  },
  methods: {
    /* 是否是网址 */
    isUrl(item) {
      return util.isUrl(item.path);
    }
  }
}
</script>
