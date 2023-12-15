let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var yhtuserid = request.yhtuserid;
    var users = [];
    users.push(yhtuserid);
    var param = { userId: users };
    let url = "https://www.example.com/";
    let apiResponse = openLinker("POST", url, "ycContractManagement", JSON.stringify(param));
    let resObj = JSON.parse(apiResponse);
    let result = {};
    if (resObj && resObj.data && resObj.data.data && resObj.data.data.length > 0) {
      result = resObj.data.data[0];
    }
    return result;
  }
}
exports({ entryPoint: MyAPIHandler });