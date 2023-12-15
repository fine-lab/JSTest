let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    // 收件人邮箱
    var mailReceiver = ["https://www.example.com/"];
    // 消息通道
    var channels = ["mail"];
    // 信息封装
    var messageInfo = {
      sysId: "yourIdHere",
      tenantId: "yourIdHere",
      mailReceiver: mailReceiver,
      channels: channels,
      subject: "工单系统预警通知[分派人接收]",
      content: "请登录交付工单系统进行工单处理"
    };
    var result = sendMessage(messageInfo);
    // 可用来弹出发送状态信息
    return {
      result
    };
  }
}
exports({
  entryPoint: MyTrigger
});