let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let url = "https://www.example.com/";
    var user = ["ea764084-6c48-43b7-8ba7-62a47a767034"];
    var body = {
      appId: "0",
      content: "testa", //JSON.stringify(context),
      highlight: "",
      yhtUserIds: user,
      tenantId: "yourIdHere",
      sendScope: "list",
      title: "审批流测试",
      esnData: {
      }
    };
    let apiResponse = openLinker("POST", url, "GT1431AT3", JSON.stringify(body)); //TODO：注意填写应用编码(请看注意事项)
    return { apiResponse };
  }
}
exports({ entryPoint: MyAPIHandler });