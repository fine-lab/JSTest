let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var uspaceReceiver = ["2c149722-6576-44fc-9891-b6599d268452"];
    var channels = ["uspace"];
    // 发送消息的标题
    var title = "友空间预警通知";
    // 发送消息的内容
    var content = "友空间预警通知验证";
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
    return {};
  }
}
exports({ entryPoint: MyTrigger });