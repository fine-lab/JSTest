let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var qinggouDanId = request.data;
    let body = {};
    let url = "https://www.example.com/" + qinggouDanId;
    let apiResponse = openLinker("GET", url, "PU", JSON.stringify(body));
    return { apiResponse };
  }
}
exports({ entryPoint: MyAPIHandler });