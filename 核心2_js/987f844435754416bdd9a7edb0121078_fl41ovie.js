let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var mailReceiver = ["https://www.example.com/", "https://www.example.com/"];
    var channels = ["mail"];
    var messageInfo = {
      sysId: "yourIdHere",
      tenantId: "yourIdHere",
      mailReceiver: mailReceiver,
      channels: channels,
      subject: "第一期",
      content: "阿斯顿发生短发是短发发的身份"
    };
    var result = sendMessage(messageInfo);
    return {};
  }
}
exports({ entryPoint: MyTrigger });