/** 主入口js */
import {createApp} from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import axios from 'axios';
import VueAxios from 'vue-axios';
import setting from './config/setting';
import permission from './utils/permission';
// import _ from 'lodash';
import './config/axios-config';
import EleAdminPro from 'ele-admin-pro';
import './styles/index.less';

import i18n from './lang';
// import MComonents from './components/index'
/*vxEtable 4.0*/
import 'xe-utils'
import VXETable from 'vxe-table'
VXETable.setup({zIndex:100})
import 'vxe-table/lib/style.css'

const app = createApp(App);
app.config.productionTip = false;
// app.use(_);
app.use(store);
app.use(router);
app.use(VueAxios, axios);
app.use(EleAdminPro);
app.use(permission);
app.config.globalProperties.$setting = setting;
app.config.globalProperties.$app = app;
app.use(i18n);

app.use(VXETable);


app.config.globalProperties.$XModal = VXETable.modal

// app.use(MComonents);

//vue3 基础组件的自动化全局注册
const requireComponent = require.context(
  // 其组件目录的相对路径
  '@/components',
  // 'C:\\model',
  // 是否查询其子目录
  true,
  // 匹配基础组件文件名的正则表达式
  /\.vue$/
)

requireComponent.keys().forEach(fileName => {
  // debugger
  // 获取组件配置
  const componentConfig = requireComponent(fileName)
  // 全局注册组件

  app.component(
    componentConfig.default.name,
    // 如果这个组件选项是通过 `export default` 导出的，
    // 那么就会优先使用 `.default`，
    // 否则回退到使用模块的根。
    componentConfig.default || componentConfig
  )
})


app.mount('#app');


