<!-- 顶栏 license by http://eleadmin.com -->
<template>
  <div :class="['ele-admin-header', {'ele-bg-primary': headStyle === 2}]">
    <!-- logo -->
    <div class="ele-admin-logo" @click="onLogoClick">
      <slot name="logo"/>
      <span v-if="projectName">{{ projectName }}</span>
    </div>
    <!-- 左侧功能区 -->
    <div class="ele-admin-header-tool" v-if="showLeftTool">
      <div v-if="showCollapse" class="ele-admin-header-tool-item" @click="toggleCollapse">
        <MenuUnfoldOutlined v-if="collapse"/>
        <MenuFoldOutlined v-else/>
      </div>
      <div v-if="showRefresh" class="ele-admin-header-tool-item" @click="reloadPage">
        <ReloadOutlined/>
      </div>
      <!-- 自定义左侧功能 -->
      <slot name="left"/>
    </div>
    <!-- 面包屑导航 -->
    <a-breadcrumb
      v-if="showBreadcrumb"
      class="ele-admin-breadcrumb"
      :separator="breadcrumbSeparator">
      <a-breadcrumb-item v-for="(d, i) in levels" :key="i">
        <router-link v-if="d.home" to="/">
          <home-outlined/>
        </router-link>
        <span v-else>{{ d.title }}</span>
      </a-breadcrumb-item>
    </a-breadcrumb>
    <!-- 自定义中间区域 -->
    <slot name="center"/>
    <!-- 顶部菜单区 -->
    <a-menu
      mode="horizontal"
      :selected-keys="active"
      class="ele-admin-header-nav"
      :theme="['light', 'dark', 'light'][headStyle]">
      <template v-for="menu in menus">
        <ele-pro-sidebar-item v-if="!menu.meta.hide" :key="menu.path" :item="menu"/>
      </template>
    </a-menu>
    <!-- 右侧功能区 -->
    <slot name="right"/>
  </div>
</template>

<script>
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ReloadOutlined,
  HomeOutlined
} from '@ant-design/icons-vue';
import EleProSidebarItem from '../../ele-pro-sidebar-item';

export default {
  name: 'EleProHeader',
  components: {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    ReloadOutlined,
    HomeOutlined,
    EleProSidebarItem
  },
  emits: [
    'logo-click',
    'reload-page',
    'toggle-collapse'
  ],
  props: {
    // 项目名
    projectName: String,
    // 面包屑导航数据
    levels: Array,
    // 顶栏菜单数据
    menus: Array,
    // 顶栏菜单选中
    active: Array,
    // 顶栏风格
    headStyle: Number,
    // 是否折叠侧边栏
    collapse: Boolean,
    // 是否显示左边功能区
    showLeftTool: Boolean,
    // 是否显示折叠按钮
    showCollapse: Boolean,
    // 是否显示刷新按钮
    showRefresh: Boolean,
    // 是否显示面包屑导航
    showBreadcrumb: Boolean,
    // 面包屑导航分隔符
    breadcrumbSeparator: String
  },
  methods: {
    /* 折叠展开侧栏 */
    toggleCollapse() {
      this.$emit('toggle-collapse');
    },
    /* 刷新页面 */
    reloadPage() {
      this.$emit('reload-page');
    },
    /* logo点击事件 */
    onLogoClick() {
      this.$emit('logo-click');
    }
  }
}
</script>
