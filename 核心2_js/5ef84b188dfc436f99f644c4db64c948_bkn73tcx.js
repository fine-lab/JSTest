let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let url = "http://123.57.144.40:8890/budget/makeNextBudget";
    var strResponse = postman("POST", url, null, JSON.stringify(request));
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });