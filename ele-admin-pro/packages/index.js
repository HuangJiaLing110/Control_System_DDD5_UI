/** ele admin pro license by http://eleadmin.com */
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import Antd from 'ant-design-vue';
import EleAvatarList from './ele-avatar-list';
import EleEditTag from './ele-edit-tag';
import EleEmptyLayout from './ele-empty-layout';
import EleIframeLayout from './ele-iframe-layout';
import EleProHeader from './ele-pro-header';
import EleProLayout from './ele-pro-layout';
import EleProSetting from './ele-pro-setting';
import EleProSidebar from './ele-pro-sidebar';
import EleProSidebarItem from './ele-pro-sidebar-item';
import EleProSidebarMenus from './ele-pro-sidebar-menus';
import EleProSidebarNav from './ele-pro-sidebar-nav';
import EleProTable from './ele-pro-table';
import EleProTableTools from './ele-pro-table-tools';
import EleProTabs from './ele-pro-tabs';
import EleTag from './ele-tag';
import EleToolbar from './ele-toolbar';
import util from './util.js';

const install = function (app, opt) {
    // 配置nprogress
    NProgress.configure(Object.assign({
      showSpinner: false,
      trickleSpeed: 300
    }, opt ? opt.nProgress : null));
    // 安装antd
    app.use(Antd);
    // 注册全局组件
    app.component(EleAvatarList.name, EleAvatarList);
    app.component(EleEditTag.name, EleEditTag);
    app.component(EleEmptyLayout.name, EleEmptyLayout);
    app.component(EleIframeLayout.name, EleIframeLayout);
    app.component(EleProHeader.name, EleProHeader);
    app.component(EleProLayout.name, EleProLayout);
    app.component(EleProSetting.name, EleProSetting);
    app.component(EleProSidebar.name, EleProSidebar);
    app.component(EleProSidebarItem.name, EleProSidebarItem);
    app.component(EleProSidebarMenus.name, EleProSidebarMenus);
    app.component(EleProSidebarNav.name, EleProSidebarNav);
    app.component(EleProTable.name, EleProTable);
    app.component(EleProTableTools.name, EleProTableTools);
    app.component(EleProTabs.name, EleProTabs);
    app.component(EleTag.name, EleTag);
    app.component(EleToolbar.name, EleToolbar);
    // 添加全局属性
    app.config.globalProperties.$util = util;
    app.config.globalProperties.$ELEADMIN = {
      request: opt ? opt.request : null,
      response: opt ? opt.response : null
    };
  },
  /* 判断路由地址是否是外链的方法 */
  isUrl = util.isUrl,
  /**
   * 判断路由地址是否已经添加
   * @param path 路由地址
   * @param data 路由数据
   * @returns {boolean}
   */
  pathIsAdd = function (path, data) {
    let isAdd = false;
    util.eachTreeData(data, (item) => {
      if (path === item.path) {
        isAdd = true;
        return false;
      }
    });
    return isAdd;
  },
  /**
   * 菜单数据转成路由数据
   * @param menus 菜单数据
   * @param importComponent 加载组件的方法
   * @param added 已添加的路由
   * @returns { Array } 路由数据
   */
  menuToRoutes = function (menus, importComponent, added) {
    if (!menus) {
      return null;
    }
    let routes = [], addedRoutes = added ? [].concat(added) : [];
    menus.forEach((item) => {

      const path = (item.path && item.path.includes('?')) ? item.path.substring(0, item.path.indexOf('?')) : item.path;
      if (path && item.openType != 2  && !pathIsAdd(path, addedRoutes)) {
        let meta = Object.assign({}, item.meta);
        let component;
        if (item.openType==0) {
          if(item.component)
          {
            component = function () {
              console.log(item.component)
              return importComponent(item.component);
            }
          }
          else
          {
            component = EleEmptyLayout;
          }
        } else if (item.openType==1) {
          component = EleIframeLayout;
          meta.iframe = item.component;
          meta.hideFooter = true;
        }
        if (item.openType !=2 )
        {
          addedRoutes.push({path: item.path});
          routes.push({
            meta: meta,
            name: item.path,
            path: item.path,
            component: component,
            redirect: item.redirect,
            children: menuToRoutes(item.children, importComponent, addedRoutes)
          });
        }
      }
    });
    return routes;
  },

  // firstChildPath = function (item)
  // {
  //   if (!item.children || !item.children.length) {
  //     if (!home && item.path && !isUrl(item.path)) {
  //       home = {
  //         path: item.path,
  //         title: item.title
  //       };
  //     }
  //     return item;
  //   }
  //   for(var i in item.children )
  //   {
  //     let child = firstChildPath(item.children[i])
  //     if(child)
  //     {
  //       if(child.path) {
  //         item.menuType = child.menuType
  //         item.openType = child.openType
  //         item.component = child.component
  //         item.path = child.path
  //
  //         return item;
  //       }
  //     }
  //   }
  // },

  /**
   * 格式化菜单数据
   * @param data 菜单数据
   * @param parseMenuItem 自定义格式菜单item
   * @returns {{homePath: String, homeTitle: String, menus: Array}}
   */
  formatMenus = function (data, parseMenuItem) {
    // debugger
    let home = null
    // let firstChildPath = function (item)
    // {
    //   if (!item.children || !item.children.length) {
    //     if (!home && item.path && !isUrl(item.path)) {
    //       home = {
    //         path: item.path,
    //         title: item.title
    //       };
    //     }
    //     return item;
    //   }
    //   for(var i in item.children )
    //   {
    //     let child = firstChildPath(item.children[i])
    //     if(child)
    //     {
    //       if(child.path) {
    //         item.menuType = child.menuType
    //         item.openType = child.openType
    //         item.component = child.component
    //         item.path = child.path
    //
    //         return item;
    //       }
    //     }
    //   }
    // }
    let menus = util.formatTreeData(data, (d) => {
      let item = parseMenuItem ? parseMenuItem(d) : Object.assign({}, d);
      item.meta = Object.assign({
        title: item.title,
        icon: item.icon,
        hide: item.hide,
        active: item.active || item.uid,
        hideFooter: item.hideFooter,
        hideSidebar: item.hideSidebar,
        tabUnique: item.tabUnique
      }, item.meta);

      // firstChildPath(item)

      if (!item.children || !item.children.length) {
        if (!home && item.path && !isUrl(item.path)) {
          home = {
            path: item.path,
            title: item.meta.title
          };
        }
      } else if (item.children[0].path) {
        const cp = item.children[0].path;
        if (!item.redirect) {
          item.redirect = cp;
        }
        if (!item.path) {
          item.path = cp.substring(0, cp.lastIndexOf('/'));
        }
      }

      // if (!item.path) {
      //   console.error('菜单的path作为vue循环的key不能为空且要唯一: ', d);
      //   return false;
      // }
      return item;
    });
    return {
      menus: menus,
      homePath: home ? home.path : null,
      homeTitle: home ? home.title : null
    };
  };

export {
  EleAvatarList,
  EleEditTag,
  EleEmptyLayout,
  EleIframeLayout,
  EleProHeader,
  EleProLayout,
  EleProSetting,
  EleProSidebar,
  EleProSidebarItem,
  EleProSidebarMenus,
  EleProSidebarNav,
  EleProTable,
  EleProTableTools,
  EleProTabs,
  EleTag,
  EleToolbar,
  util,
  isUrl,
  menuToRoutes,
  formatMenus
}

export default {
  install
}
