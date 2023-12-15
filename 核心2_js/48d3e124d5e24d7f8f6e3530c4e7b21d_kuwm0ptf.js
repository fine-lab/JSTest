let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var user = JSON.parse(AppContext()).currentUser;
    var tenantId = user.tenantId;
    var title = "这是title";
    var content = "内容";
    var mailReceiver = ["https://www.example.com/"];
    var channels = ["mail"];
    var messageInfo = {
      sysId: "yourIdHere",
      tenantId: tenantId,
      mailReceiver: mailReceiver,
      channels: channels,
      subject: "这是主题",
      content: content
    };
    var result = sendMessage(messageInfo);
    throw new Error(JSON.stringify(result));
    return {};
  }
}
exports({ entryPoint: MyTrigger });