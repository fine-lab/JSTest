let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //查询组织信息
    var title = request.title;
    var content = request.content;
    var user = request.user;
    if (!user) {
      user = ["ea764084-6c48-43b7-8ba7-62a47a767034"];
    }
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
      highlight: "",
      yhtUserIds: user,
      tenantId: "yourIdHere",
      sendScope: "list",
      title: title,
      esnData: {
      }
    };
    let url = "https://www.example.com/";
    let apiResponse = openLinker("POST", url, "GT30659AT3", JSON.stringify(body));
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });