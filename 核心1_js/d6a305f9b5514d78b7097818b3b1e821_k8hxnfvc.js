let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param, title) {
    var sPara = JSON.stringify(param);
    //调试： 发送邮件给管理员
    var mailReceiver = ["https://www.example.com/"];
    var channels = ["mail"];
    var messageInfo = {
      sysId: "yourIdHere",
      tenantId: "yourIdHere",
      mailReceiver: mailReceiver,
      channels: channels,
      subject: title,
      content: sPara
    };
    var result = sendMessage(messageInfo);
    return result;
  }
}
exports({ entryPoint: MyTrigger });