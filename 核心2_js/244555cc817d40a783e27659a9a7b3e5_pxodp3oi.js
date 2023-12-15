let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let obj = JSON.parse(AppContext());
    let tid = obj.currentUser.tenantId;
    let channels = ["uspace"];
    let title = "销售订单已审批通过";
    let content = "销售订单";
    let url = "https://www.example.com/";
    let messageInfo = {
      sysId: "yourIdHere",
      tenantId: tid,
      createToDoReceiver: ["87c94daf-0be9-4a2e-9638-d429f17f04ef"],
      receiver: ["87c94daf-0be9-4a2e-9638-d429f17f04ef"],
      uspaceReceiver: ["87c94daf-0be9-4a2e-9638-d429f17f04ef"],
      channels: channels,
      subject: title,
      content: content,
      messageType: "creatToDo",
      createToDoExt: {
        webUrl: url,
        url: url,
        miniProgramUrl: url
      }
    };
    var result = sendMessage(messageInfo);
    return {
      result
    };
  }
}
exports({
  entryPoint: MyAPIHandler
});