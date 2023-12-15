let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let obj = JSON.parse(AppContext());
    let tid = obj.currentUser.tenantId;
    var uspaceReceiver = ["c7d043e7-0320-4a90-81ee-28f0ed9fde7a"];
    var channels = ["uspace"];
    var title = "友空间工作通知";
    var content = "友空间工作通知-验证-ZS";
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