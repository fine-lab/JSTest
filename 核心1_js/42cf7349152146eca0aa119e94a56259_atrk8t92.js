let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let body = {
      roleId: "yourIdHere",
      pageNumber: 1,
      pageSize: 10
    };
    let url = "https://www.example.com/";
    let apiResponse = openLinker("POST", url, "udinghuo", JSON.stringify(body));
    return { apiResponse };
  }
}
exports({ entryPoint: MyAPIHandler });