let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let url = "https://www.example.com/";
    let apiResponse = openLinker("GET", url, "PU", JSON.stringify({}));
    var res = JSON.parse(apiResponse);
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });