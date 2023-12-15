let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var currentUser = JSON.parse(AppContext()).currentUser; //通过上下文获取当前的用户信息
    let tenantId = currentUser.tenantId; //获取企业信息id(租户id)
    let requestUrl = "https://www.example.com/" + tenantId;
    let header = {
      "Content-Type": "application/json"
    };
    var strResponse = postman("GET", requestUrl, JSON.stringify(header), null);
    var responseObj = JSON.parse(strResponse);
    if (responseObj.code != "00000") {
      throw new Error("此租户获取数据中心地址异常");
    }
    let returnData = { code: 200, gatewayUrl: responseObj.data.gatewayUrl, tokenUrl: responseObj.data.tokenUrl };
    return returnData;
  }
}
exports({ entryPoint: MyAPIHandler });