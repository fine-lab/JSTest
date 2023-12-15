let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let body = {
      roleId: "yourIdHere",
      pageSize: 20,
      pageNumber: 1
    };
    let url = "https://www.example.com/";
    let apiResponse = openLinker("POST", url, "AT16AD797616380008", JSON.stringify(body));
    return {
      apiResponse
    };
  }
}
exports({
  entryPoint: MyAPIHandler
});