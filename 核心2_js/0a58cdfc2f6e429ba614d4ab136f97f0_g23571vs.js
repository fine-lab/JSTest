let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var merchant = request.merchant;
    let url = "https://www.example.com/";
    let body = {
      merchant: merchant
    };
    let apiResponse = openLinker("POST", url, "SCMSA", JSON.stringify(body));
    return { res: apiResponse };
  }
}
exports({ entryPoint: MyAPIHandler });