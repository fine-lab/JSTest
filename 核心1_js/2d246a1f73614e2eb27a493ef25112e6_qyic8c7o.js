let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let id = request.id;
    let body = {}; //ycContractManagement.backWorkflowFunction.quertSecLevelDeptManager
    let url = "https://www.example.com/" + id;
    let apiResponse = openLinker("GET", url, "ycContractManagement", JSON.stringify(body));
    return JSON.parse(apiResponse);
  }
}
exports({ entryPoint: MyAPIHandler });