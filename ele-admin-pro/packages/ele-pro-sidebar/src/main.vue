<!-- 侧边栏 license by http://eleadmin.com -->
<template>
  <div class="ele-admin-sidebar ele-scrollbar-hide">
    <slot name="top"/>
    <div class="ele-admin-sidebar-menus">
      <a-menu
        v-if="useDeep"
        mode="inline"
        :theme="menuTheme"
        :inline-indent="16"
        :open-keys="openKeys"
        :selected-keys="menuActive"
        :inline-collapsed="collapse"
        @openChange="onOpenChange">
        <template v-for="menu in menuData">
          <ele-pro-sidebar-item
            v-if="!menu.meta.hide"
            :key="menu.path"
            :item="menu"/>
        </template>
      </a-menu>
      <ele-pro-sidebar-menus
        v-else
        :menus="menuData"
        :theme="menuTheme"
        :inline-indent="16"
        :open-keys="openKeys"
        :selected-keys="menuActive"
        :inline-collapsed="collapse"
        @openChange="onOpenChange"/>
    </div>
    <slot name="bottom"/>
  </div>
</template>

<script>
import EleProSidebarItem from '../../ele-pro-sidebar-item';
import EleProSidebarMenus from '../../ele-pro-sidebar-menus';

export default {
  name: 'EleProSidebar',
  components: {EleProSidebarItem, EleProSidebarMenus},
  props: {
    // 侧边栏菜单数据
    menuData: Array,
    // 侧边栏菜单选中
    menuActive: Array,
    // 侧边栏菜单展开
    menuOpen: Array,
    // 是否折叠侧边栏
    collapse: Boolean,
    // 侧边栏风格, light | dark
    menuTheme: String,
    // 侧边栏是否只保持一个子菜单展开
    sideUniqueOpen: Boolean,
    // 是否使用递归渲染菜单item
    useDeep: Boolean
  },
  data() {
    return {
      // 侧边栏展开的key
      openKeys: this.collapse ? [] : this.menuOpen,
      // 侧边栏展开的key备份
      openKeysCopy: this.menuOpen
    };
  },
  methods: {
    /* 菜单展开事件 */
    onOpenChange(keys) {
      if (this.collapse) {
        this.openKeys = keys;
      } else {
        if (this.sideUniqueOpen && keys.length && (keys.length > this.openKeysCopy.length)) {
          const cks = keys.filter((k) => !this.openKeysCopy.some((t) => (k === t)));
          this.openKeysCopy = this.getTreeKeys(this.menuData, cks[0]) || [];
        } else {
          this.openKeysCopy = keys;
        }
        this.openKeys = this.openKeysCopy;
      }
    },
    /* 获取key及所有父级key */
    getTreeKeys(data, key, pks) {
      if (!pks) {
        pks = [];
      }
      for (let i = 0; i < data.length; i++) {
        const d = data[i];
        if (d.path === key) {
          return pks.concat([key]);
        } else if (d.children && d.children.length) {
          const ks = this.getTreeKeys(d.children, key, pks.concat([d.path]));
          if (ks) {
            return ks;
          }
        }
      }
    }
  },
  watch: {
    collapse() {
      if (this.collapse) {
        this.openKeys = [];
      } else {
        this.openKeys = this.openKeysCopy;
      }
    },
    menuOpen() {
      this.openKeysCopy = this.menuOpen;
      if (!this.collapse) {
        this.openKeys = this.openKeysCopy;
      }
    }
  }
}
</script>
