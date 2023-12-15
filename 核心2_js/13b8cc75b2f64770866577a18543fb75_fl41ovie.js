let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var mailReceiver = ["https://www.example.com/"];
    var channels = ["mail"];
    var messageInfo = {
      sysId: "yourIdHere",
      tenantId: context.tenantid,
      mailReceiver: mailReceiver,
      channels: channels,
      subject: "normal mail title",
      content: param.content
    };
    var result = sendMessage(messageInfo);
    var strResponse = postman("get", "https://www.example.com/" + result.msg, null, null);
    return context;
  }
}
exports({ entryPoint: MyTrigger });