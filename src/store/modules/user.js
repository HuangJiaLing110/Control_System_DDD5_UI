/**
 * 登录状态管理
 */
import axios from 'axios';
import {formatMenus, menuToRoutes} from '@/config/app';
import setting from '@/config/setting';
import EleLayout from "@/layout/index";
import router from "@/router";
import store from "@/store";
import {Socket} from "@/config/Socket";

export default {
  namespaced: true,
  state: {
    // 当前用户信息
    user: setting.takeUser(),
    // 当前用户权限
    authorities: [],
    // 当前用户角色
    roles: [],
    // 当前用户的菜单
    menus: null,
    // 当前打开的选项卡
    tabs: [],
    //字典缓存
    dicts: [],
    //系统参数缓存
    configs: [],

    socket: new Socket(),
    //选中的搅拌站ID
    selectedMixingStation: setting.getCacheMixingPlant()

  },
  mutations: {
    // 修改值
    SET(state, obj) {
      state[obj.key] = obj.value;
    },
    // 修改token
    SET_TOKEN(state, obj) {
      setting.cacheToken(obj.token, obj.remember);
      state.token = obj.token;
      if (!obj.token) {
        state.user = {};
        state.menus = null;
        state.tabs = [];
        setting.cacheUser();
      }
    },
    // 添加tab
    TAB_PUSH(state, obj) {
      let i = state.tabs.findIndex((d) => d.key === obj.key);
      if (i === -1) {
        state.tabs = state.tabs.concat([obj]);
        return;
      }
      if (obj.fullPath !== state.tabs[i].fullPath) {
        state.tabs = state.tabs.slice(0, i).concat([obj]).concat(state.tabs.slice(i + 1));
      }
    },
    /**
     * 设置默认选中的搅拌站
     * @param commit
     * @param
     */
    SET_MIXINGSTATION(state,mixingStation) {
      setting.cacheMixingPlant(mixingStation)
      state.selectedMixingStation=mixingStation
      // commit('SET', {key: 'selectedMixingStation', value: mixingStation});
    },

  },
  actions: {
    /**
     * 缓存token
     * @param commit
     * @param token {String, {token: String, remember: String}}
     */
    setToken({commit}, token) {
      let remember = true;
      if (typeof token === 'object') {
        remember = token.remember;
        token = token.token;
      }
      commit('SET_TOKEN', {token: token, remember: remember});
    },
    /**
     * 移除token
     * @param commit
     */
    removeToken({commit}) {
      commit('SET_TOKEN', {});
    },
    /**
     * 设置用户信息
     * @param commit
     * @param user {Object} 用户信息
     */
    setUser({commit}, user) {
      setting.cacheUser(user);
      commit('SET', {key: 'user', value: user});
    },
    /**
     * 设置用户权限
     * @param commit
     * @param authorities {Array<String>} 权限
     */
    setAuthorities({commit}, authorities) {
      commit('SET', {key: 'authorities', value: authorities});
    },
    /**
     * 设置用户角色
     * @param commit
     * @param roles {Array<String>} 角色
     */
    setRoles({commit}, roles) {
      commit('SET', {key: 'roles', value: roles});
    },
    /**
     * 设置用户菜单
     * @param commit
     * @param menus {Array<Object>} 菜单
     */
    setMenus({commit}, menus) {
      commit('SET', {key: 'menus', value: menus});
    },
    /**
     * 获取用户菜单路由
     * @param commit
     * @returns {Promise<>} {menus: Array, home: String}
     */
    getMenus({commit},user) {
      store.dispatch('user/setUser', user);
      store.dispatch('user/setRoles', user ? user.roles : null);
      store.dispatch('user/setAuthorities', user ? user.authorities : null);
      store.dispatch('user/SET_DICTS', user ? user.dicts: null);
      store.dispatch('user/SET_CONFIGS', user ? user.configs : null);

      store.state.user.socket.initWebSocket();

      // formatMenus方法主要用于把接口的菜单数据转成带有meta格式的数据
      const {menus, homePath, homeTitle} = formatMenus(user.menus, setting.parseMenuItem());
      if (!setting.homeTitle) {
        setting.homeTitle = homeTitle;
      }
      commit('SET', {key: 'menus', value: menus});

      let importComponent = (component) => {
        // console.log(component)
        return import('@/views' + component);
      }
      router.addRoute({
        name: '/',
        path: '/',
        component: EleLayout,
        redirect: setting.homePath || homePath,
        children: menuToRoutes(menus, importComponent)
      });
    },
    getUser() {
      return new Promise((resolve, reject) => {
        axios.get(setting.userUrl).then((res) => {
          const result = setting.parseUser ? setting.parseUser(res.data) : res.data;
          if (result.code === 0) {
            const user = result.data;
            setting.cacheDicts(user.dicts);
            setting.cacheConfigs(user.configs);
            setting.cacheUser(user);

           //store.dispatch('user/getMenus',user)
            resolve();

          } else if (result.msg) {
            this.$message.error(result.msg);
            return reject(new Error(result.msg));
          }

        }).catch((e) => {
          console.error(e);

          this.$message.error(e.message);
          return reject(new Error(e.message));
        })
      })

      //
      //
      //
      //   axios.get(setting.menuUrl).then(res => {
      //     let result = setting.parseMenu ? setting.parseMenu(res.data) : res.data;
      //     // 获取用户的信息、角色、权限
      //     if (result.user) {
      //       setting.cacheUser(result.user);
      //       commit('SET', {key: 'user', value: result.user});
      //       commit('SET', {key: 'roles', value: result.user.roles});
      //       commit('SET', {key: 'authorities', value: result.user.authorities});
      //     }
      //     // 获取用户的菜单
      //     if (!result.data) {
      //       return reject(new Error(result.msg));
      //     }
      //     // formatMenus方法主要用于把接口的菜单数据转成带有meta格式的数据
      //     const {menus, homePath, homeTitle} = formatMenus(result.data, setting.parseMenuItem());
      //     if (!setting.homeTitle) {
      //       setting.homeTitle = homeTitle;
      //     }
      //     commit('SET', {key: 'menus', value: menus});
      //     debugger
      //     resolve({menus: menus, home: homePath});
      //   }).catch(e => {
      //     reject(e);
      //   });
      // });
    },
    /**
     * 添加新tab
     * @param commit
     * @param obj {{path: String, title: String}} tab信息
     */
    tabAdd({commit}, obj) {
      commit('TAB_PUSH', obj);
    },
    /**
     * 关闭指定tab
     * @param commit
     * @param state
     * @param key {String}
     * @returns {Promise<>}
     */
    tabRemove({commit, state}, key) {
      return new Promise((resolve) => {
        let index = -1, lastIndex = -1, lastPath, last;
        for (let i = 0; i < state.tabs.length; i++) {
          if (state.tabs[i].key === key || state.tabs[i].fullPath === key) {
            index = i;
            break;
          }
          lastIndex = i;
          last = state.tabs[i];
          lastPath = last.fullPath;
        }
        commit('SET', {key: 'tabs', value: state.tabs.filter((d, i) => i !== index)});
        resolve({lastIndex: lastIndex, lastPath: lastPath, last: last});
      });
    },
    /**
     * 关闭所有tab
     * @param commit
     */
    tabRemoveAll({commit}) {
      commit('SET', {key: 'tabs', value: []});
    },
    /**
     * 关闭左侧tab
     * @param commit
     * @param state
     * @param key {String}
     */
    tabRemoveLeft({commit, state}, key) {
      for (let i = 0; i < state.tabs.length; i++) {
        if (state.tabs[i].key === key) {
          commit('SET', {key: 'tabs', value: state.tabs.slice(i)});
          break;
        }
      }
    },
    /**
     * 关闭右侧tab
     * @param commit
     * @param state
     * @param key {String}
     */
    tabRemoveRight({commit, state}, key) {
      for (let i = 0; i < state.tabs.length; i++) {
        if (state.tabs[i].key === key) {
          commit('SET', {key: 'tabs', value: state.tabs.slice(0, i + 1)});
          break;
        }
      }
    },
    /**
     * 关闭其他tab
     * @param commit
     * @param state
     * @param key {String}
     */
    tabRemoveOther({commit, state}, key) {
      commit('SET', {key: 'tabs', value: state.tabs.filter((d) => d.key === key)});
    },
    /**
     * 修改指定tab标题
     * @param commit
     * @param state
     * @param obj {{path: String, title: String, fullPath: String, closable: Boolean}}
     */
    tabSetTitle({commit, state}, obj) {
      let i = -1;
      if (obj.fullPath) {
        i = state.tabs.findIndex((d) => d.fullPath === obj.fullPath);
      } else if (obj.path) {
        i = state.tabs.findIndex((d) => d.path === obj.path);
      }
      if (i !== -1) {
        const data = Object.assign({}, state.tabs[i]);
        if (typeof obj.title !== 'undefined') {
          data.title = obj.title;
        }
        if (typeof obj.closable !== 'undefined') {
          data.closable = obj.closable;
        }
        const tabs = state.tabs.slice(0, i).concat([data]).concat(state.tabs.slice(i + 1));
        commit('SET', {key: 'tabs', value: tabs});
      }
    },
    SET_DICTS({commit}, dicts) {
      commit("SET", {key:'user/dicts',dicts});
    },
    SET_CONFIGS({commit}, configs){
      commit("SET", {key:'user/configs',configs});
    }
  },
}
