let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var uspaceReceiver = ["c7d043e7-0320-4a90-81ee-28f0ed9fde7a", "126515c4-e045-46ed-94c5-7ceb14c1949c", "75ab8707-8ece-4b94-9646-1f8fc10bec1d"];
    var channels = ["uspace"];
    var title = "2023职级认证人员基础信息填写通知";
    var content = "请在答辩前完成填写职级认证人员基础信息。";
    let url = "https://www.example.com/";
    var messageInfo = {
      sysId: "yourIdHere",
      tenantId: "yourIdHere", // 用友开发者中心运营平台
      uspaceReceiver: uspaceReceiver,
      receiver: uspaceReceiver,
      channels: channels,
      subject: title,
      content: content,
      messageType: "notice",
      uspaceExt: {
        webUrl: url,
        mUrl: url
      }
    };
    var result = sendMessage(messageInfo);
    return {
      result
    };
  }
}
exports({ entryPoint: MyTrigger });