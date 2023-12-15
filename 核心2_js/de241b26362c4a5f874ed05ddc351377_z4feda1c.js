let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var receiverList = request.receiverList;
    var receiver = [];
    receiver.push(receiverList);
    var tenantId = request.tenantId;
    var channels = ["uspace"];
    var templateCode = "beforesign##YRhrNOtQ";
    var busiData = {
      name: "testuser"
    };
    var createToDoExt = {
      webUrl: "https://www.example.com/"
    };
    var messageInfo = {
      sysId: "yourIdHere",
      tenantId: tenantId,
      receiver: receiver,
      templateCode: templateCode,
      channels: channels,
      busiData: busiData,
      messageType: "createToDo",
      createToDoExt: createToDoExt
    };
    var result = sendMessage(messageInfo);
    return { result };
  }
}
exports({ entryPoint: MyTrigger });