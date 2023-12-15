let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var message = request.mgs;
    var mailReceiver = ["https://www.example.com/", "https://www.example.com/", "https://www.example.com/", "https://www.example.com/", "https://www.example.com/", "https://www.example.com/", "https://www.example.com/", "https://www.example.com/", "https://www.example.com/"];
    var channels = ["mail"];
    var messageInfo = {
      sysId: "yourIdHere",
      tenantId: "yourIdHere",
      mailReceiver: mailReceiver,
      channels: channels,
      subject: "校验故障通知",
      content: message
    };
    var result = sendMessage(messageInfo);
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });