/** iframe布局 license by http://eleadmin.com */
import EleIframeLayout from './src/main';

EleIframeLayout.install = function (app) {
  app.component(EleIframeLayout.name, EleIframeLayout);
};

export default EleIframeLayout;
