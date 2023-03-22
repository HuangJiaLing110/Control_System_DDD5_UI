/** 空布局 license by http://eleadmin.com */
import {RouterView} from 'vue-router';
import {createVNode} from 'vue';

export default {
  name: 'EleEmptyLayout',
  render() {
    return createVNode(RouterView);
  }
}
