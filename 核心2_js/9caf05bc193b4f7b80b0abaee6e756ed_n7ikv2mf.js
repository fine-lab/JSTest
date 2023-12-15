let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //查询组织信息
    var title = request.title;
    var content = request.content;
    var hmd_contenttype = "application/json;charset=UTF-8";
    let header = {
      "Content-Type": hmd_contenttype
    };
    var body = {
      appId: "0",
      content: content,
      highlight: "碗里",
      yhtUserIds: ["ea764084-6c48-43b7-8ba7-62a47a767034"],
      tenantId: "yourIdHere",
      sendScope: "list",
      title: title,
      esnData: {
      }
    };
    let url = "https://www.example.com/";
    let userInfos = openLinker("POST", url, "GT30661AT5", JSON.stringify(body));
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });