let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let body = { userIds: [request.id] };
    let url = "https://www.example.com/";
    let apiResponse = openLinker("POST", url, "AT16AD797616380008", JSON.stringify(body));
    return {
      apiResponse
    };
  }
}
exports({ entryPoint: MyAPIHandler });