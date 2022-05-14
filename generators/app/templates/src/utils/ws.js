const WebSocket = require("ws");
const quertString = require("querystring");

class ws {
  static online = 0; // 在线连接
  static ws = WebSocket.Server; //默认实例
  static init(server) {
    // 创建实例
    this.ws = new WebSocket.Server({ server, path: "/ws" });
    this.ws.on("connection", async (ws, request) => {
      if (!request.url.includes("/ws")) {
        return ws.close();
      }
      this.online = this.ws._server._connections;
      console.log(`socket当前在线${this.online}个连接`);
      const queryUrl = request.url.split("?")[1] || "";
      const { token } = quertString.parse(queryUrl);
      if (!token) {
        return ws.close();
      }
      try {
        //do something
        // 这里可以做一些加强判断查询数据库等行为

        ws.token = token; // 添加ws实例的唯一标识
        const obj = { message: "连接成功", retCode: 200 };
        ws.send(JSON.stringify(obj));
        // 处理接受到消息
        this.onMessage(ws);
      } catch (error) {
        console.log("websocket connection error", error);
        return ws.close();
      }
    });
  }

  // 接收到数据
  static onMessage(ws) {
    ws.on("message", (bufferData) => {
      const token = ws.token;
      const data = bufferData.toString("utf8");
      const obj = {
        token,
        data,
      };
      this.sendToCliect(obj);
    });
  }

  // 发送客户端数据
  static sendToCliect(Data) {
    let iskeep = false; // 加个变量做下发成功判断
    if (!(this.ws instanceof WebSocket.Server)) {
      return iskeep;
    }
    const { token, data } = Data;
    this.ws.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN && client.token === token) {
        // 发送给指定匹配id
        client.send(data);
        iskeep = true;
      }
    });
    return iskeep;
  }
}
module.exports = ws;
