import Message from 'ant-design-vue';

/**
 * 全局提示
 * @param 'success' | 'error' | 'warn' | 'info'
 * @param msg
 */

export default class Msg {
  static success(msg) {
    Message.success(msg)
  }

  static error(msg) {
    Message.error(msg)
  }

  static warn(msg) {
    Message.warning(msg)
  }

  static info(msg) {
    Message.info(msg)
  }
}
