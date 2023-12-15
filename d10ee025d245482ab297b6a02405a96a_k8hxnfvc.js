let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var id = request.id;
    let url = "https://www.example.com/" + id;
    let apiResponse = openLinker("GET", url, "ycContractManagement", null);
    let res = JSON.parse(apiResponse);
    let data = res.data;
    if (!data) {
      data = {};
    }
    return data;
  }
}
exports({ entryPoint: MyAPIHandler });