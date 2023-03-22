/** 数字动画组件 license by http://eleadmin.com */
import EleCountUp from './src/main';

EleCountUp.install = function (app) {
  app.component(EleCountUp.name, EleCountUp);
};

export default EleCountUp;
