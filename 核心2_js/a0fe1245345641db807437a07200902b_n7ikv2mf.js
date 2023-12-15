let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var hmd_contenttype = "application/json;charset=UTF-8";
    let header = {
      "Content-Type": hmd_contenttype
    };
    var body = {
      appId: "0",
      content: "审批完成",
      highlight: "碗里",
      yhtUserIds: ["ea764084-6c48-43b7-8ba7-62a47a767034"],
      tenantId: "yourIdHere",
      sendScope: "list",
      title: "你好消息",
      esnData: {
      }
    };
    let url = "https://www.example.com/";
    let userInfos = openLinker("POST", url, "GT30661AT5", JSON.stringify(body));
    return { userInfos };
  }
}
exports({ entryPoint: MyTrigger });