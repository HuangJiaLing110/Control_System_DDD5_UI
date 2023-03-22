import setting from "@/config/setting";
import {message} from 'ant-design-vue';

export class Socket {
  constructor() {
    // debugger
    // console.log("start socket")
    this.heartInterval = 1000 * 10;
    this.heartSeverTimeout = 1000 * 6;
    this.url = process.env.VUE_SOCKET_BASE_URL;
    this.device = "pc"
    this.messageBox = message;
  }

  initWebSocket() {

    this.url = "ws://localhost:8081/WebSocket/" + this.device + "?token=" + setting.takeToken();
    // http://192.168.0.228:8080/

    this.websocket = new WebSocket(this.url)
    // 连接错误
    this.websocket.onerror = this.setErrorMessage()

    // 连接成功
    this.websocket.onopen = this.setOnopenMessage()

    // 收到消息的回调
    this.websocket.onmessage = this.setOnmessageMessage()

    // 连接关闭的回调
    this.websocket.onclose = this.setOncloseMessage()

    // 监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
    window.onbeforeunload = this.onbeforeunload()

    this.subscriptions = {}
  }

  reconnect() {
    // 重新连接
    if (this.lockReconnect) return;
    this.lockReconnect = true;
    //没连接上会一直重连，设置延迟避免请求过多
    this.timeoutnum && clearTimeout(this.timeoutnum);
    this.timeoutnum = setTimeout(() => {
      //新连接
      this.initWebSocket();
      this.lockReconnect = false;
    }, 5000);
  }

  reset() { // 重置心跳
    // 清除时间
    clearTimeout(this.heartTimeObj);
    clearTimeout(this.serverTimeoutObj);
    // 重启心跳
    this.start();
  }

  start() { // 开启心跳
    this.heartTimeObj && clearTimeout(this.heartTimeObj);
    this.serverTimeoutObj && clearTimeout(this.serverTimeoutObj);
    this.heartTimeObj = setTimeout(() => {
      // 这里发送一个心跳，后端收到后，返回一个心跳消息，
      console.log("start" + '   状态码：' + this.websocket.readyState)
      if (this.websocket && this.websocket.readyState == 1) { // 如果连接正常
        this.websocketsend('mt');
      } else { // 否则重连
        this.reconnect();
      }
      this.serverTimeoutObj = setTimeout(() => {
        //超时关闭
        this.websocket.close();
      }, this.heartSeverTimeout);

    }, this.heartInterval)
  }

  setOnmessageMessage() {
    return (event) => {

      this.reset();
      let message = event.data;
      // console.log("接收到的服务器消息：", message)
      if ("mt" === message) return;
      if ("connected" == message) {
        this.messageBox.success("实时消息连接成功");
      }
      let headerStr = message.substring(0, message.indexOf("\n\n"))
      let command = headerStr.substring(0, headerStr.indexOf("\n"));
      headerStr = message.substring(message.indexOf("\n") + 1)
      let bodyJson = message.substring(message.indexOf("\n\n") + 2, message.length - 2)
      var lines = headerStr.split("\n");
      let headers = {};
      lines.forEach((line) => {
        let keyValue = line.split(":");
        headers[keyValue[0]] = keyValue[1];
      })

      let body = bodyJson;
      try {
        body = JSON.parse(bodyJson)
      }catch (err) {
        console.log(err)
      }

      let destination = headers["destination"];

      if (command == "MESSAGE") {


        let messageCallback = this.subscriptions[destination]
        if(messageCallback)
        {
          messageCallback(destination, body,headers)
        }


      } else if (command == "P2P") {
        let messageCallback = this.subscriptions[destination]
        let fromUser = headers["fromUser"]
        if(messageCallback)
        {
          messageCallback(destination, body, headers,fromUser)
        }
      }

      // let obj = JSON.parse(event.data);
      // console.log("obj",obj)
      // switch(obj.type) {
      //   case 'heartbeat':
      //     //收到服务器信息，心跳重置
      //     this.reset();
      //     break;
      //   case 'sendMessage':
      //     this.data = obj.data
      //     console.log("接收到的服务器消息：",obj.data)
      // }

    }
  }

  setErrorMessage() {
    return () => {
      // console.log(e);
      // console.log("WebSocket连接发生错误" + '   状态码：' + this.websocket.readyState)
      //重连
      this.reconnect();
    }

  }

  setOnopenMessage() {
    return () => {
      //开启心跳
      this.start();
      console.log("WebSocket连接成功" + '   状态码：' + this.websocket.readyState)

    }
  }

  setOncloseMessage() {
    return () => {
      //重连
      this.reconnect();
      console.log("WebSocket连接关闭" + '   状态码：' + this.websocket.readyState)
    }
  }

  onbeforeunload() {
    return () => {
      this.closeWebSocket();
    }

  }

//websocket发送消息
  websocketsend(messsage) {
    this.websocket.send(messsage)
  }

  closeWebSocket() { // 关闭websocket
    this.websocket.close()
  }

  createMessage(command, headers, body) {
    let message = command + "\n";
    if (headers) {
      for (let headerKey in headers) {
        message += headerKey + ":" + headers[headerKey] + "\n";
      }
    }
    message += "\n";
    if (body) {
      message += JSON.stringify(body) + "^@";
    }
    return message;
  }

  stompPublish(destination, body) {
    let headers = {destination: destination, "content-type": "application/json"};
    let message = this.createMessage("SEND", headers, body)
    this.websocketsend(message);
  }
  stompP2P(destination,toUser, body) {
    let headers = {destination: destination,toUser:toUser,"content-type": "application/json"};
    let message = this.createMessage("P2P", headers, body)
    this.websocketsend(message);
  }
   stompSubscribe(destination, messageCallback) {
    let headers = {destination: destination, "content-type": "application/json"};
    let message = this.createMessage("SUBSCRIBE", headers)
    this.websocketsend(message);
    this.subscriptions[destination] = messageCallback;
  }

  stompUnsubscribe(destination) {
    let headers = {destination: destination, "content-type": "application/json"};
    let message = this.createMessage("UNSUBSCRIBE", headers)
    this.websocketsend(message);
    this.subscriptions[destination] = void 0;
  }


}
