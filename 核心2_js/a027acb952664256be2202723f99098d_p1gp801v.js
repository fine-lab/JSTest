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
      subject: "测试推送邮件",
      content: "审批后推送邮件"
    };
    var result = sendMessage(messageInfo);
    // 可用来弹出发送状态信息
    return {
      result
    };
  }
}
exports({ entryPoint: MyTrigger });