let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var uspaceReceiver = request.uid;
    var channels = ["uspace"];
    var title = "新员工培训";
    var content = request.content;
    var messageInfo = {
      sysId: "yourIdHere",
      tenantId: "yourIdHere",
      uspaceReceiver: uspaceReceiver,
      channels: channels,
      subject: title,
      content: content,
      url: "https://www.yonyou.com"
    };
    var result = sendMessage(messageInfo);
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });