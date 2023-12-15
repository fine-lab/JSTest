let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let url = "https://www.example.com/" + request.id + "?domainKey=developplatform";
    var receiver = ["95dd88f9-bfb5-4bea-898f-5d71a6adea80"];
    var channels = ["uspace"];
    var title = "代办消息 from ssr 1.2";
    var content = "content 3";
    var createToDoExt = {
      webUrl: url
    };
    var messageInfo = {
      sysId: "yourIdHere",
      tenantId: "yourIdHere",
      receiver: receiver,
      channels: channels,
      subject: title,
      content: content,
      messageType: "createToDo",
      createToDoExt: createToDoExt
    };
    var result = sendMessage(messageInfo);
    return { r: request };
  }
}
exports({ entryPoint: MyAPIHandler });