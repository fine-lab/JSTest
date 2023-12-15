let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let sysId = "yourIdHere";
    let user = JSON.parse(AppContext()).currentUser;
    var tenantId = user.tenantId;
    var uspaceReceiver = [user.id];
    var channels = ["uspace"];
    var title = "title";
    var content = "content";
    var messageInfo = {
      sysId: sysId, //系统id
      tenantId: tenantId, //租户id
      uspaceReceiver: uspaceReceiver, //收件人
      channels: channels, //通道配置
      subject: title, //标题
      content: content, //内容
      groupCode: "prewarning" //消息类型
    };
    var result = sendMessage(messageInfo);
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });