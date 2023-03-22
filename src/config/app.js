import  { util,EleEmptyLayout} from 'ele-admin-pro';
import {IframeLayout} from '@/components'
import setting from "@/config/setting";


const install = function () {},




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
          component = IframeLayout;
          meta.url = item.url;
          //item.path = "/url/"+item.menuId;
          meta.hideFooter = true;
        }
        if (item.openType !=2 )
        {
          if(! component)
          {
            alert("组件为空，"+item.path)
            //throw new Error("组件为空，"+item.path);
            return
          }
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
      }else  if ( ! path && item.children){
        item.path ="/"+item.menuId
        addedRoutes.push({path: item.path});
        routes.push({
          meta: null,
          name: item.path,
          path: item.path,
          component: EleEmptyLayout,
          redirect: item.redirect,
          children: menuToRoutes(item.children, importComponent, addedRoutes)
        });
      }
        });
    return routes;
  },

  // firstChildPath = function (item)
  // {
  //   if (!item.children || !item.children.length) {
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
  //         //item.component = child.component
  //         item.path = child.path+"__cp"
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
    util.formatTreeData(data, (item) => {
      if (item.openType==1) {
        item.url = item.path;
        item.path = "/url/"+item.menuId;

      }
      return item;
    });
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
      }
     // firstChildPath(item)
      // else if (item.children[0].path) {
      //   const cp = item.children[0].path;
      //   if (!item.redirect) {
      //     item.redirect = cp;
      //   }
      //   if (!item.path) {
      //     item.path =cp+"__cp";// cp.substring(0, cp.lastIndexOf('/'));
      //     // item.openType = item.children[0].openType;
      //     // item.component = item.children[0].component;
      //   }
      // }

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
  },
  formatUrl=function(url) {

  let params = {};
  params.appUrl= process.env.VUE_APP_BASE_URL
  params.token = setting.takeToken()

  if(url && url.indexOf("#{")>=0)
  {
    for(let name in params)
    {
      url=url.replaceAll("#{"+name+"}",params[name])
    }
  }
  return url;
};

export {
  menuToRoutes,
  formatMenus,
  formatUrl,


}

export default {
  install
}
