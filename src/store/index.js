/**
 * vuex状态管理
 */
import {createStore} from 'vuex';
import getters from './getters';
import theme from './modules/theme';
import user from './modules/user';
// import setting from "@/config/setting";

export default createStore({
  state: {
    //字典缓存
    // dicts: [],
    //系统参数缓存
    // con: [],
  },
  mutations: {
    /*setDict(state, dicts) {
     state.dicts=dicts;
     setting.cacheDict(dicts);
    },
    setCon(state, obj){
      state.con=obj;
      setting.cacheCon(obj);
    }*/
  },
  actions: {
    // SET_DICT({commit}, dict) {
    //   commit("setDict", dict);
    // },
    // SET_CON({commit}, con){
    //   commit("setCon", con);
    // }
  },
  modules: {
    theme,
    user
  },
  getters
});
