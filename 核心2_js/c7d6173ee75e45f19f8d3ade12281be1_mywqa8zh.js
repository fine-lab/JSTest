let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var currentUser = JSON.parse(AppContext()).currentUser;
    var receiver = [currentUser.id];
    var channels = ["uspace"];
    var title = "中标评价任务";
    var content = "家评价：专家已全 部完成中标评价，请完善中标条件并发起中标评审";
    var createToDoExt = {
      webUrl: "https://www.example.com/"
    };
    var messageInfo = {
      sysId: "yourIdHere",
      tenantId: currentUser.tenantId,
      receiver: receiver,
      channels: channels,
      subject: title,
      content: content,
      messageType: "createToDo",
      createToDoExt: createToDoExt
    };
    var result = sendMessage(messageInfo);
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });