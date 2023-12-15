let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var id = request.id;
    let url = "https://www.example.com/" + id;
    let apiResponse = openLinker("GET", url, "ycContractManagement", JSON.stringify({}));
    let resObj = JSON.parse(apiResponse);
    let result = {};
    if (resObj && resObj.data) {
      result = resObj.data;
    }
    return result;
  }
}
exports({ entryPoint: MyAPIHandler });