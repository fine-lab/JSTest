let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var cgrkId = request.data;
    let body = {};
    let url = "https://www.example.com/" + cgrkId;
    let apiResponse = openLinker("GET", url, "ST", JSON.stringify(body));
    return { apiResponse };
  }
}
exports({ entryPoint: MyAPIHandler });