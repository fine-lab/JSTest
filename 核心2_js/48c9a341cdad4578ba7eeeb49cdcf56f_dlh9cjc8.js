let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //查询组织信息
    var title = request.title;
    var content = request.content;
    let func1 = extrequire("GT30659AT3.backDefaultGroup.getAccessToken");
    var paramToken = {};
    let resToken = func1.execute(paramToken);
    var token = resToken.access_token;
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
    var userInfos = postman("post", "https://www.example.com/" + token, JSON.stringify(header), JSON.stringify(body));
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });