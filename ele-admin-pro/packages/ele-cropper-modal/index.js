/** 图片裁剪弹窗组件 license by http://eleadmin.com */
import EleCropperModal from './src/main';

EleCropperModal.install = function (app) {
  app.component(EleCropperModal.name, EleCropperModal);
};

export default EleCropperModal;
