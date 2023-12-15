let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var res = AppContext();
    var uspaceReceiver = [];
    uspaceReceiver.push(JSON.parse(AppContext()).currentUser.id);
    var channels = ["sy01"];
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
    let menchantQueryUrl = "https://www.example.com/";
    let params = {
      yhtUserIds: ["97167f71-d697-4d95-bfce-0cfc8309441f"],
      labelCode: "sy01",
      title: "标题名称",
      content: "通知内容xxxx",
      url: "https://www.diwork.com",
      webUrl: "https://www.diwork.com",
      miniProgramUrl: "",
      srcMsgId: "OA_APP:000006"
    };
    let apiResponse = openLinker("POST", menchantQueryUrl, "GT22176AT10", JSON.stringify(params));
    let obj = JSON.parse(apiResponse);
    return { obj };
  }
}
exports({ entryPoint: MyAPIHandler });