let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let id = request.id;
    let url = "https://www.example.com/" + id;
    let apiResponse = openLinker("GET", url, "ycContractManagement", JSON.stringify({}));
    return JSON.parse(apiResponse).data;
  }
}
exports({ entryPoint: MyAPIHandler });