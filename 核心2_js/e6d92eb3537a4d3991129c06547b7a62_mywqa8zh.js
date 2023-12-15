let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //发送预警
    var uspaceReceiver = ["728166e1-8050-48ea-8f53-f00c33d3b8bf"];
    var channels = ["uspace"];
    var title = "设备管理预警通知";
    var content = "设备编码" + shebeibianma + ",到期时间" + xiacixiaozhunriqi;
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
    throw new Error(JSON.stringify(result));
  }
}
exports({ entryPoint: MyTrigger });