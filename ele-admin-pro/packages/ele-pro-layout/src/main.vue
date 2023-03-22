<!-- ele admin 布局 license by http://eleadmin.com -->
<template>
  <div :class="layoutClass">
    <!-- 顶栏 -->
    <ele-pro-header
      :project-name="projectName"
      :levels="levels"
      :menus="headMenuData"
      :active="headMenuActive"
      :head-style="headStyle"
      :collapse="collapse"
      :show-left-tool="showHeadLeftTool"
      :show-collapse="showCollapse && showSidebar"
      :show-refresh="showRefresh"
      :show-breadcrumb="showBreadcrumb && layoutStyle === 0"
      :breadcrumb-separator="breadcrumbSeparator"
      @logo-click="onLogoClick"
      @reload-page="reloadPage"
      @toggle-collapse="toggleCollapse">
      <template #logo>
        <slot name="logo">
          <img :src="logo" alt="logo"/>
        </slot>
      </template>
      <template #left>
        <slot name="left"/>
      </template>
      <template #center>
        <slot name="center"/>
      </template>
      <template #right>
        <slot name="right"/>
      </template>
    </ele-pro-header>
    <div class="ele-admin-main">
      <!-- 侧栏一级导航 -->
      <ele-pro-sidebar-nav
        v-if="showSidebarNav"
        :data="sideNavData"
        :active="sideNavActive"
        :collapse="sideCollapse">
        <template #top>
          <slot name="nav-top"/>
        </template>
        <template #bottom>
          <slot name="nav-bottom"/>
        </template>
      </ele-pro-sidebar-nav>
      <!-- 侧栏 -->
      <ele-pro-sidebar
        v-if="showSidebarMenu"
        :menu-data="sideMenuData"
        :menu-active="sideMenuActive"
        :menu-open="sideMenuOpen"
        :collapse="sideMenuCollapse"
        :menu-theme="sideMenuTheme"
        :side-menu-style="sideMenuStyle"
        :side-unique-open="sideUniqueOpen"
        :use-deep="useDeep">
        <template #top>
          <slot name="top"/>
        </template>
        <template #bottom>
          <slot name="bottom"/>
        </template>
      </ele-pro-sidebar>
      <!-- 主体 -->
      <div class="ele-admin-body">
        <!-- 多页签 -->
        <ele-pro-tabs
          v-if="showTabs"
          :tabs="allTabs"
          :active="tabActive"
          :home-title="homeTitle"
          :click-reload="clickReload"
          :show-refresh="showTabRefresh"
          :body-fullscreen="bodyFullscreen"
          @tab-add="tabAdd"
          @tab-remove="tabRemove"
          @tab-remove-all="tabRemoveAll"
          @tab-remove-left="tabRemoveLeft"
          @tab-remove-right="tabRemoveRight"
          @tab-remove-other="tabRemoveOther"
          @fullscreen-body="fullscreenBody"
          @reload-page="reloadPage"/>
        <!-- 内容区域 -->
        <div v-if="showContent" class="ele-admin-content">
          <div class="ele-admin-content-view">
            <router-view v-if="!reloading" v-slot="{Component}">
              <keep-alive :include="keepAliveList">
                <component :is="Component"/>
              </keep-alive>
            </router-view>
          </div>
          <template v-if="showFooter && !hideFooter">
            <slot name="footer"/>
          </template>
        </div>
      </div>
    </div>
    <!-- 小屏幕下遮罩层 -->
    <div class="ele-admin-shade" @click="toggleCollapse"></div>
    <!-- 主题设置抽屉 -->
    <ele-pro-setting
      v-if="needSetting"
      :visible="showSetting"
      :head-style="headStyle"
      :side-style="sideStyle"
      :layout-style="layoutStyle"
      :side-menu-style="sideMenuStyle"
      :body-full="bodyFull"
      :fixed-body="fixedBody"
      :fixed-header="fixedHeader"
      :fixed-sidebar="fixedSidebar"
      :logo-auto-size="logoAutoSize"
      :side-unique-open="sideUniqueOpen"
      :colorful-icon="colorfulIcon"
      :show-footer="showFooter"
      :show-tabs="showTabs"
      :tab-style="tabStyle"
      :weak-mode="weakMode"
      :dark-mode="darkMode"
      :themes="themes"
      :color="color"
      :tips="tips"
      @change-style="changeStyle"
      @change-color="changeColor"
      @update:visible="updateShowSetting"/>
    <!-- 自定义内容 -->
    <slot/>
  </div>
</template>

<script>
import NProgress from 'nprogress';
import debounce from 'lodash-es/debounce';
import EleProHeader from '../../ele-pro-header';
import EleProSidebar from '../../ele-pro-sidebar';
import EleProSidebarNav from '../../ele-pro-sidebar-nav';
import EleProTabs from '../../ele-pro-tabs';
import EleProSetting from '../../ele-pro-setting';
import util from '../../util.js';

export default {
  name: 'EleProLayout',
  components: {
    EleProHeader,
    EleProSidebar,
    EleProSidebarNav,
    EleProTabs,
    EleProSetting
  },
  emits: [
    'logo-click',
    'update-screen',
    'update-collapse',
    'tab-add',
    'tab-remove',
    'tab-remove-all',
    'tab-remove-left',
    'tab-remove-right',
    'tab-remove-other',
    'change-color',
    'change-style',
    'update:show-setting'
  ],
  props: {
    // 全部菜单数据
    menus: {
      type: Array,
      default() {
        return [];
      }
    },
    // 标签页数据
    tabs: {
      type: Array,
      default() {
        return [];
      }
    },
    // logo
    logo: {
      type: String,
      default: 'https://cdn.eleadmin.com/20200610/logo.svg'
    },
    // 项目名
    projectName: {
      type: String,
      default: 'Ele Admin Pro'
    },
    // 主页标题
    homeTitle: {
      type: String,
      default: '主页'
    },
    // 是否显示折叠按钮
    showCollapse: {
      type: Boolean,
      default: true
    },
    // 是否显示刷新按钮
    showRefresh: {
      type: Boolean,
      default: true
    },
    // 是否显示面包屑导航
    showBreadcrumb: {
      type: Boolean,
      default: true
    },
    // 面包屑导航分隔符
    breadcrumbSeparator: {
      type: String,
      default: '/'
    },
    // 是否折叠侧边栏
    collapse: {
      type: Boolean,
      default: false
    },
    // 顶栏风格, light | dark
    headStyle: {
      type: Number,
      default: 0
    },
    // 侧边栏风格, light | dark
    sideStyle: {
      type: Number,
      default: 1
    },
    // 布局风格, default | top | mix
    layoutStyle: {
      type: Number,
      default: 0
    },
    // 侧边栏菜单模式, default | mix
    sideMenuStyle: {
      type: String,
      default: 'default'
    },
    // 是否固定顶栏
    fixedHeader: {
      type: Boolean,
      default: false
    },
    // 是否固定侧栏
    fixedSidebar: {
      type: Boolean,
      default: true
    },
    // 是否固定主体
    fixedBody: {
      type: Boolean,
      default: false
    },
    // 内容区域宽度是否铺满
    bodyFull: {
      type: Boolean,
      default: true
    },
    // logo宽度是否自适应
    logoAutoSize: Boolean,
    // 是否显示全局页脚
    showFooter: Boolean,
    // 侧边栏是否彩色图标
    colorfulIcon: Boolean,
    // 侧边栏是否只保持一个子菜单展开
    sideUniqueOpen: {
      type: Boolean,
      default: true
    },
    // 是否开启多页签
    showTabs: {
      type: Boolean,
      default: true
    },
    // 标签页风格, default | dot | card
    tabStyle: {
      type: Number,
      default: 0
    },
    // 是否色弱模式
    weakMode: Boolean,
    // 是否暗黑模式
    darkMode: Boolean,
    // 当前主题色
    color: String,
    // 是否需要主题设置抽屉
    needSetting: {
      type: Boolean,
      default: true
    },
    // 是否打开主题设置抽屉, 支持.sycn修饰
    showSetting: Boolean,
    // 主题设置抽屉界面显示的主题列表
    themes: {
      type: Array,
      default() {
        return [];
      }
    },
    // 主题设置抽屉界面提示文字
    tips: {
      type: String,
      default: ''
    },
    // 是否显示主体部分
    showContent: {
      type: Boolean,
      default: true
    },
    // 是否再次点击选中tab刷新
    clickReload: Boolean,
    // 不显示全局页脚的路由
    hideFooters: Array,
    // 不显示侧边栏的路由
    hideSidebars: Array,
    // 可重复打开页签的路由地址
    repeatableTabs: Array,
    // 需要缓存的组件
    keepAliveList: Array,
    // 是否使用递归渲染侧边菜单item
    useDeep: Boolean,
    // 自定义菜单标题的i18n
    i18n: Function
  },
  data() {
    return {
      // 国际化处理后的菜单数据
      allMenus: [],
      // 国际化处理后的多页签数据
      allTabs: [],
      // 面包屑导航数据
      levels: [],
      // 侧边栏一级菜单数据
      sideNavData: [],
      // 侧边栏菜单数据
      sideMenuData: [],
      // 侧边栏一级菜单选中
      sideNavActive: null,
      // 侧边栏菜单选中
      sideMenuActive: [],
      // 侧边栏菜单展开
      sideMenuOpen: [],
      // 顶栏菜单数据
      headMenuData: [],
      // 顶栏菜单选中
      headMenuActive: [],
      // 多页签选中
      tabActive: '/',
      // 当前路由是否隐藏侧栏
      hideSidebar: false,
      // 当前路由是否隐藏页脚
      hideFooter: false,
      // 是否全屏内容区域
      bodyFullscreen: false,
      // 是否正在刷新内容区域
      reloading: false,
      // 屏幕宽度
      screenWidth: document.documentElement.clientWidth || document.body.clientWidth,
      // 窗口大小改变监听器
      onResizeListener: debounce(() => {
        this.updateScreen();
      }, 300)
    };
  },
  computed: {
    // 布局class
    layoutClass() {
      return [
        'ele-admin-layout',
        // 折叠侧边栏
        {'ele-admin-collapse': this.collapse},
        // 固定顶栏
        {'ele-admin-fixed-header': this.fixedHeader},
        // 固定侧边栏
        {'ele-admin-fixed-sidebar': this.fixedSidebar && (this.layoutStyle !== 1) && this.showSidebar},
        // 固定主体
        {'ele-admin-fixed-body': this.fixedBody},
        // 暗色顶栏
        {'ele-admin-head-dark': this.headStyle !== 0},
        // 暗色侧边栏
        {'ele-admin-side-dark': this.sideStyle === 1},
        // 侧边栏双排菜单
        {'ele-admin-side-mix': this.sideMenuStyle === 'mix'},
        // 侧边栏彩色图标
        {'ele-admin-side-colorful': this.colorfulIcon},
        // logo宽度自适应
        {'ele-admin-logo-auto': this.logoAutoSize || this.layoutStyle === 1 || !this.showSidebar},
        // 开启多页签
        {'ele-admin-show-tabs': this.showTabs},
        // 圆点风格页签
        {'ele-admin-tab-dot': this.tabStyle === 1},
        // 卡片风格页签
        {'ele-admin-tab-card': this.tabStyle === 2},
        // 主体内容定宽
        {'ele-admin-body-limit': !this.bodyFull},
        // 内容区域全屏
        {'ele-admin-body-fullscreen': this.bodyFullscreen}
      ]
    },
    // 是否折叠侧边栏
    sideCollapse() {
      return this.screenWidth < 768 ? false : this.collapse;
    },
    // 是否折叠侧边栏菜单
    sideMenuCollapse() {
      return this.sideMenuStyle === 'mix' ? false : this.sideCollapse;
    },
    // 侧边栏菜单主题
    sideMenuTheme() {
      if (this.sideMenuStyle === 'mix' && this.screenWidth >= 768) {
        return 'light';
      }
      return this.sideStyle === 1 ? 'dark' : 'light';
    },
    // 是否显示顶栏左侧功能区
    showHeadLeftTool() {
      return this.layoutStyle !== 1 || this.screenWidth < 768;
    },
    // 是否显示侧边栏一级菜单
    showSidebarNav() {
      if (this.sideMenuStyle !== 'mix') {
        return false;
      }
      if (this.screenWidth < 768) {
        return true;
      }
      if (this.layoutStyle === 1) {
        return false;
      }
      if (!this.sideNavData || !this.sideNavData.length) {
        return false;
      }
      return !this.hideSidebar;
    },
    // 是否显示侧边栏菜单
    showSidebarMenu() {
      if (this.screenWidth < 768) {
        return true;
      }
      if (this.layoutStyle === 1) {
        return false;
      }
      if (!this.sideMenuData || !this.sideMenuData.length) {
        return false;
      }
      return !this.hideSidebar;
    },
    // 是否显示侧边栏
    showSidebar() {
      return this.showSidebarNav || this.showSidebarMenu;
    },
    // tab右侧下拉是否显示刷新按钮
    showTabRefresh() {
      return (this.layoutStyle === 1 && this.screenWidth >= 768) || this.bodyFullscreen;
    }
  },
  mounted() {
    this.changeLanguage();
    this.onRouteChange();
    // 监听浏览器窗口大小改变
    window.addEventListener('resize', this.onResizeListener);
  },
  methods: {
    /* 折叠展开侧栏 */
    toggleCollapse() {
      this.updateCollapse(!this.collapse);
    },
    /* 更新侧栏折叠状态 */
    updateCollapse(value) {
      this.$emit('update-collapse', value);
    },
    /* logo点击事件 */
    onLogoClick() {
      this.$emit('logo-click', this.isHome(this.$route));
    },
    /* 刷新页面 */
    reloadPage() {
      if (this.reloading) {
        return;
      }
      this.reloading = true;
      NProgress.start();
      this.$nextTick(() => {
        this.reloading = false;
        setTimeout(() => {
          NProgress.done(true);
        }, 300);
      });
    },
    /* 内容区域全屏切换 */
    fullscreenBody() {
      this.bodyFullscreen = !this.bodyFullscreen;
    },
    /* 更新屏幕尺寸 */
    updateScreen() {
      this.screenWidth = document.documentElement.clientWidth || document.body.clientWidth;
      this.$emit('update-screen', {
        width: this.screenWidth,
        height: document.documentElement.clientHeight || document.body.clientHeight
      });
    },
    /* 添加tab */
    tabAdd(value) {
      this.$emit('tab-add', value);
    },
    /* 移除tab */
    tabRemove(value) {
      this.$emit('tab-remove', value);
    },
    /* 移除左边tab */
    tabRemoveLeft(value) {
      this.$emit('tab-remove-left', value);
    },
    /* 移除右边tab */
    tabRemoveRight(value) {
      this.$emit('tab-remove-right', value);
    },
    /* 移除其它tab */
    tabRemoveOther(value) {
      this.$emit('tab-remove-other', value);
    },
    /* 移除全部tab */
    tabRemoveAll(value) {
      if (this.tabActive !== '/') {
        this.$router.push('/');
      }
      this.$emit('tab-remove-all', value);
    },
    /* 切换主题色 */
    changeColor(value) {
      this.$emit('change-color', value);
    },
    /* 切换主题风格 */
    changeStyle(value) {
      this.$emit('change-style', value);
    },
    /* 修改设置抽屉的visible */
    updateShowSetting(value) {
      this.$emit('update:show-setting', value);
    },
    /* 处理路由切换 */
    onRouteChange() {
      const current = this.$route;
      if (current) {
        const meta = current.meta;
        // 判断是否需要隐藏侧栏
        if (this.hideSidebars && this.hideSidebars.indexOf(current.path) !== -1) {
          this.hideSidebar = true;
        } else {
          this.hideSidebar = !!(meta && meta.hideSidebar);
        }
        // 判断是否需要隐藏页脚
        if (this.hideFooters && this.hideFooters.indexOf(current.path) !== -1) {
          this.hideFooter = true;
        } else {
          this.hideFooter = !!(meta && meta.hideFooter);
        }
        // 获取面包屑导航数据
        const matched = current.matched, levels = [], isHome = this.isHome(current);
        if (!isHome) {
          levels.push({home: true, title: this.homeTitle});
        }
        matched.forEach((d) => {
          if (d.meta && d.meta.title && d.meta.breadcrumb !== false) {
            levels.push(this.toLevelObject(d.path, d.meta.title));
          }
        });
        this.levels = levels;
        // 添加页签
        if (isHome) {
          this.tabActive = '/';
        } else {
          let title, closable, key = current.path;
          if (meta) {
            title = meta.title;
            closable = meta.closable;
            if (meta.tabUnique === false || (this.repeatableTabs && this.repeatableTabs.indexOf(key) !== -1)) {
              key = current.fullPath;
            }
          }
          if (typeof closable === 'undefined' || closable === null) {
            closable = true;
          }
          this.tabActive = key;
          this.$emit('tab-add', {
            key: key,
            title: title,
            path: current.path,
            fullPath: current.fullPath,
            closable: closable
          });
        }
        // 获取顶栏和侧边栏的菜单选中
        this.updateMenuActive(current);
      }
      // 更新顶栏和侧边栏的菜单数据
      if (this.layoutStyle === 2 || this.sideMenuStyle === 'mix') {
        this.updateMenuData();
      }
      // 小屏幕下自动收起侧边栏
      if (this.screenWidth < 768) {
        this.$emit('update-collapse', true);
      }
    },
    /* 是否是主页 */
    isHome(route) {
      const path = route.path, matched = route.matched;
      return ('/' === path) || (matched && matched.length && matched[0].redirect === path);
    },
    /* 获取path对应的面包屑导航数据 */
    toLevelObject(path, title) {
      const menu = this.findMenuByPath(path);
      return {
        path: path,
        title: (menu && menu.meta && menu.meta.title) || title
      };
    },
    /* 获取path对应的菜单数据 */
    findMenuByPath(path) {
      let data;
      util.eachTreeData(this.allMenus, (d) => {
        if (path === d.path) {
          data = d;
          return false;
        }
      });
      return data;
    },
    /* 更新顶栏和侧边栏的菜单选中 */
    updateMenuActive(current) {
      const matched = current.matched, openKeys = [];
      let active = current.path, active1 = null, active2 = null;
      if (current.meta && (current.meta.active || current.meta.uid)) {
        active = String(current.meta.active || current.meta.uid);
      }
      if (matched.length) {
        let match1 = matched[matched.length - 1], match2 = matched[matched.length - 1];
        if (matched.length > 1) {
          match1 = matched[1];
        }
        if (matched.length > 2) {
          match2 = matched[2];
        }
        if (match1.meta && (match1.meta.active || match1.meta.uid)) {
          active1 = String(match1.meta.active || match1.meta.uid);
        } else {
          active1 = match1.path;
        }
        if (match2.meta && (match2.meta.active || match2.meta.uid)) {
          active2 = String(match2.meta.active || match2.meta.uid);
        } else {
          active2 = match2.path;
        }
        // 获取菜单展开的key
        matched.forEach((d, index) => {
          if (index !== 0 && index !== (matched.length - 1)) {
            openKeys.push(d.path);
          }
        });
      }
      if (this.layoutStyle === 1) {  // 顶栏导航模式
        this.headMenuActive = [active].concat(openKeys);
        this.sideNavActive = null;
      } else if (this.layoutStyle === 2) {  // 混合导航模式
        this.headMenuActive = [active1];
        this.sideNavActive = active2;
      } else {  // 左侧导航模式
        this.headMenuActive = [];
        this.sideNavActive = active1;
      }
      this.sideMenuActive = [active].concat(openKeys);
      if (this.sideUniqueOpen) {
        this.sideMenuOpen = openKeys;
      } else {
        this.sideMenuOpen = Array.from(new Set(this.sideMenuOpen.concat(openKeys)));
      }
    },
    /* 更新顶栏和侧边栏的菜单数据 */
    updateMenuData() {
      if (!this.allMenus || !this.allMenus.length) {
        this.headMenuData = [];
        this.sideNavData = [];
        this.sideMenuData = [];
      } else if (this.screenWidth < 768) {  // 移动设备
        this.headMenuData = [];
        this.sideNavData = [];
        this.sideMenuData = this.allMenus;
      } else if (this.layoutStyle === 1) {  // 顶部导航模式
        this.headMenuData = this.allMenus;
        this.sideNavData = [];
        this.sideMenuData = [];
      } else if (this.layoutStyle === 2) {  // 混合导航模式
        this.headMenuData = this.allMenus.map((d) => {
          return {path: d.path, meta: d.meta};
        });
        let sideMenus = [];
        if (this.headMenuActive && this.headMenuActive.length) {
          sideMenus = this.allMenus.filter((d) => {
            return this.headMenuActive[0] === d.path
          });
        }
        sideMenus = (sideMenus.length ? sideMenus[0].children : this.allMenus[0].children) || [];
        if (!sideMenus.length) {
          this.sideNavData = [];
          this.sideMenuData = [];
        } else if (this.sideMenuStyle === 'mix') {  // 左侧双栏菜单风格
          this.sideNavData = sideMenus.map((d) => {
            return {path: d.path, meta: d.meta};
          });
          let temps = this.sideNavActive ? sideMenus.filter((d) => {
            return this.sideNavActive === d.path;
          }) : [];
          temps = (temps.length ? temps[0].children : sideMenus[0].children) || [];
          this.sideMenuData = temps;
        } else {  // 左侧默认菜单风格
          this.sideNavData = [];
          this.sideMenuData = sideMenus;
        }
      } else {  // 左侧导航模式
        this.headMenuData = [];
        if (this.sideMenuStyle === 'mix') {  // 左侧双栏菜单风格
          this.sideNavData = this.allMenus.map((d) => {
            return {path: d.path, meta: d.meta};
          });
          let temps = this.sideNavActive ? this.allMenus.filter((d) => {
            return this.sideNavActive === d.path;
          }) : [];
          temps = (temps.length ? temps[0].children : this.allMenus[0].children) || [];
          this.sideMenuData = temps;
        } else {  // 左侧默认菜单风格
          this.sideNavData = [];
          this.sideMenuData = this.allMenus;
        }
      }
    },
    /* 语言切换后重新处理数据 */
    changeLanguage() {
      this.updateAllMenus();
      this.updateAllTabs();
      this.updateLevelData();
    },
    /* 国际化改变后更新菜单数据 */
    updateAllMenus() {
      this.allMenus = util.formatTreeData(this.menus, (item) => {
        return Object.assign({}, item, {
          meta: Object.assign({}, item.meta, {
            title: this.routeI18n(item.path, item) || item.meta.title
          })
        });
      });
      this.updateMenuData();
    },
    /* 国际化改变后更新页签数据 */
    updateAllTabs() {
      const tabs = [];
      this.tabs.forEach((item) => {
        const menu = this.findMenuByPath(item.path);
        tabs.push(Object.assign({}, item, {
          title: this.routeI18n(item.path, menu) || item.title
        }));
      });
      this.allTabs = tabs;
    },
    /* 国际化改变后更新面包屑导航数据 */
    updateLevelData() {
      const levels = [];
      this.levels.forEach((d) => {
        if (d.home) {
          levels.push({home: true, title: this.homeTitle});
        } else {
          levels.push(this.toLevelObject(d.path, d.title));
        }
      });
      this.levels = levels;
    },
    /* 获取路由地址对应的il8n名称 */
    routeI18n(path, menu) {
      if (this.i18n && path) {
        let key;
        if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('//')) {
          key = path.replace(/\.(\w)/g, ($0, $1) => $1.toUpperCase());
        } else {
          key = (path.indexOf('/') === 0 ? path.substring(1) : path);
          /*if (key.includes('?')) {
            key = key.substring(0, key.indexOf('?'));
          }*/
          key = key.replace(/-(\w)/g, ($0, $1) => $1.toUpperCase())
            .replace(/_(\w)/g, ($0, $1) => $1.toUpperCase())
            .replace(/\//g, '.');
        }
        return this.i18n(path, key, menu);
      }
    }
  },
  watch: {
    $route() {
      this.onRouteChange();
    },
    layoutStyle() {
      this.updateMenuActive(this.$route);
      this.updateMenuData();
    },
    sideMenuStyle() {
      this.updateMenuData();
    },
    screenWidth() {
      this.updateMenuData();
    },
    menus() {
      this.updateAllMenus();
    },
    tabs() {
      this.updateAllTabs();
    },
    homeTitle() {
      this.updateLevelData();
    }
  },
  unmounted() {
    // 销毁浏览器窗口大小改变监听
    window.removeEventListener('resize', this.onResizeListener);
  }
}
</script>
