let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let tenantId = "yourIdHere";
    let requestUrl = "https://www.example.com/" + tenantId;
    let header = {
      "Content-Type": "application/json"
    };
    var strResponse = postman("GET", requestUrl, JSON.stringify(header), null);
    var responseObj = JSON.parse(strResponse);
    let returnData = { code: 200, gatewayUrl: responseObj.data.gatewayUrl, tokenUrl: responseObj.data.tokenUrl };
    return returnData;
  }
}
exports({ entryPoint: MyAPIHandler });