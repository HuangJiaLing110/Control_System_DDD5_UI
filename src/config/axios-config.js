/**
 * axios配置
 */
import axios from 'axios';
import store from '../store';
import router from '../router';
import setting from './setting';
import {Modal} from 'ant-design-vue';

// 设置统一的url
axios.defaults.baseURL = process.env.VUE_APP_API_BASE_URL;

/* 请求拦截器 */
axios.interceptors.request.use((config) => {
  // 添加token到header
  let token = setting.takeToken();
  if (token) {
    config.headers[setting.tokenHeaderName] = token;
  }
  return config;
}, function (error) {
  return Promise.reject(error);
});

/* 响应拦截器 */
axios.interceptors.response.use((res) => {
  // const path = router.currentRoute.path;
  // console.log(path)
  // 登录过期处理
  if (res.data.code === 401) {
    if (res.config.url === setting.menuUrl) {
      goLogin();
    } else {
      Modal.destroyAll();
      Modal.info({
        title: '系统提示',
        content: '登录状态已过期, 请退出重新登录!',
        okText: '重新登录',
        onOk: () => {
          goLogin(true);
        }
      });
    }
    let error = new Error(res.data.msg);
    error.data = res.data
    return Promise.reject(error);
  }
  // token自动续期
  let access_token = res.headers[setting.tokenHeaderName];
  if (access_token) {
    setting.cacheToken(access_token);
  }

 // 加了会导致else拿不到参数
 if (res.data && res.data.code) {
    // debugger;
    let error = {};
    error.message = res.data.msg;
    error.data = res.data
    return Promise.reject(error);
  }

  return res;
}, (error) => {
  // debugger
  return Promise.reject(error);
});

/**
 * 跳转到登录页面
 */
function goLogin(reload) {
  store.dispatch('user/removeToken').then(() => {
    if (reload) {
      const router1 = router;
      const path = router1.currentRoute.value.path
      router.push({
        path: '/login',
        query: path && path !== '/' ? {from: path} : null
      });
    } else {
      location.replace('/login');
    }
  });
}
