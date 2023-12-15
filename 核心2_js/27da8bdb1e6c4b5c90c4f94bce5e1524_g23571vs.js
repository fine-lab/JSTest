let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var merchant = request.merchant;
    let url = "https://www.example.com/" + merchant;
    let apiResponse = openLinker("get", url, "SCMSA", JSON.stringify({}));
    return { result: apiResponse };
  }
}
exports({ entryPoint: MyAPIHandler });