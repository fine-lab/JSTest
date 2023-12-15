let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let AppCode = "AT17F6A93816F80004";
    let body = {
      pageIndex: 1,
      pageSize: 10,
      isSum: false,
      simpleVOs: [
        {
          op: "lt",
          value1: "2023-05-17",
          field: "paymentSchedules.startDateTime"
        }
      ]
    };
    let url = "https://www.example.com/";
    let apiResponse = openLinker("POST", url, AppCode, JSON.stringify(body));
    let message = JSON.stringify(apiResponse);
    var uspaceReceiver = ["90015fa6-858f-4296-99f9-1ffe72e3a0f7"];
    var channels = ["uspace"];
    var title = "title work warn";
    var content = "content";
    var messageInfo = {
      sysId: "yourIdHere",
      tenantId: "yourIdHere",
      uspaceReceiver: uspaceReceiver,
      channels: channels,
      subject: title,
      content: content,
      groupCode: "prewarning"
    };
    var result = sendMessage(messageInfo);
    return { result };
  }
}
exports({ entryPoint: MyAPIHandler });