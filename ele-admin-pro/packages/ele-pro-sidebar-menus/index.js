/** 侧边栏菜单非递归 license by http://eleadmin.com */
import EleProSidebarMenus from './src/main';

EleProSidebarMenus.install = function (Vue) {
  Vue.component(EleProSidebarMenus.name, EleProSidebarMenus);
};

export default EleProSidebarMenus;
