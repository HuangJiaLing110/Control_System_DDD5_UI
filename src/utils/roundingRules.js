/**
 * 修约规则工具类class
 *  数值变量,field_precision  special_calculation   (需要参数)
 *  数值全部四舍六入
 *  先四舍六入，再修约
 * field_precision  精度(字符串类型) String(-1 0 1 2 3 4 5 6 7 8 9)
 * special_calculation  特殊计算说明 0.5 / 0.2   (字符串类型) String
 */

export  class RoundingRules{
  //四舍六入
  static roundingSix(){
    return new Promise((resolve,reject) => {
      // let data=15.12;
      // let fieldP=parseInt(1);
      // let specialCalc=parseInt(0.5)
      resolve("success")
      reject("error")
    })
  }
  //0.5修约
  static roundingZeroFive(){
    return new Promise((resolve,reject) => {
      resolve("success")
      reject("error")
    })
  }
  //0.2修约
  static roundingZeroTwo(){
    return new Promise((resolve,reject) => {
      resolve("success")
      reject("error")
    })
  }

}
