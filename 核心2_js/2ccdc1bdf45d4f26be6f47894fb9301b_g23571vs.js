let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var body = request.body;
    var strBody = JSON.stringify(body);
    let url = "https://www.example.com/";
    let apiResponse = openLinker("POST", url, "SCMSA", JSON.stringify(body));
    return { res: apiResponse };
  }
}
exports({ entryPoint: MyAPIHandler });