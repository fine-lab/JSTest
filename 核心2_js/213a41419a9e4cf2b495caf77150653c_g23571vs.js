let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let url = "https://www.example.com/" + request.code;
    let apiResponse = openLinker("GET", url, "SCMSA", JSON.stringify({}));
    return { res: apiResponse };
  }
}
exports({ entryPoint: MyAPIHandler });