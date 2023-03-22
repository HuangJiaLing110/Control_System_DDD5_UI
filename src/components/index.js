
import MDictCheckbox from './MDict/dictCheckbox';
import MDictRadio from './MDict/dictRadio' ;
import MDictSelect from './MDict/dictSelect' ;
import MDictCascader from './MDict/dictCascader' ;
import IframeLayout from "@/components/IframeLayout";

const install = function (app) {

  debugger
  // 注册全局组件
  app.component(MDictCheckbox.name, MDictCheckbox);
  app.component(MDictRadio.name, MDictRadio);
  app.component(MDictSelect.name, MDictSelect);
  app.component(MDictCascader.name, MDictCascader);
  app.component(IframeLayout.name,IframeLayout)

}
export {
    MDictCheckbox ,
    MDictRadio ,
    MDictSelect ,
    MDictCascader ,
    IframeLayout ,
}

export default {
  install
}
