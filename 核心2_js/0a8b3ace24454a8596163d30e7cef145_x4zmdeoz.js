let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let obj = JSON.parse(AppContext());
    let tid = obj.currentUser.tenantId;
    var uspaceReceiver = [];
    uspaceReceiver.push(request.userId);
    var channels = ["uspace"];
    var title = request.title;
    var content = request.msg;
    let url = "https://www.example.com/";
    var messageInfo = {
      sysId: "yourIdHere",
      tenantId: tid,
      uspaceReceiver: uspaceReceiver,
      receiver: uspaceReceiver,
      channels: channels,
      subject: title,
      content: content,
      messageType: "notice",
      uspaceExt: {
        webUrl: "",
        url: "",
        miniProgramUrl: ""
      }
    };
    var result = sendMessage(messageInfo);
    return {
      data: result
    };
  }
}
exports({
  entryPoint: MyAPIHandler
});