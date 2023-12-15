let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var mailReceiver = ["https://www.example.com/"];
    var templateCode = "todo##NScgYpgj";
    var channels = ["mail"];
    var busiData = {
      name: "testuser"
    };
    var messageInfo = {
      sysId: "yourIdHere",
      tenantId: "yourIdHere",
      templateCode: templateCode,
      busiData: busiData,
      mailReceiver: mailReceiver,
      channels: channels
    };
    var result = sendMessage(messageInfo);
    return { result };
  }
}
exports({ entryPoint: MyTrigger });