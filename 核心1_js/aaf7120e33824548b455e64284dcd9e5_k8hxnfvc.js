let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let body = {};
    let url = "https://www.example.com/";
    let apiResponse = openLinker("GET", url, "RBSM", JSON.stringify(body));
    var mailReceiver2 = ["https://www.example.com/"];
    var channels2 = ["mail"];
    var content2 = JSON.stringify(apiResponse);
    var messageInfo2 = {
      sysId: "yourIdHere",
      tenantId: "yourIdHere",
      mailReceiver: mailReceiver2,
      channels: channels2,
      subject: "灰度查询报销单结果",
      content: content2
    };
    var result2 = sendMessage(messageInfo2);
    return { apiResponse };
  }
}
exports({ entryPoint: MyAPIHandler });