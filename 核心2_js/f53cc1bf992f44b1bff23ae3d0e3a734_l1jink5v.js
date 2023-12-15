let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //销售订单
    var saleorderurl = "https://www.example.com/" + request.access_token;
    var simpleVOs = [];
    var define2 = {};
    define2["op"] = "eq";
    define2["value1"] = "科园";
    define2["field"] = "headItem.define2";
    simpleVOs.push(define2);
    var requestSimpleVOs = request.simpleVOs;
    for (var i = requestSimpleVOs.length - 1; i >= 0; i--) {
      if (requestSimpleVOs[i].field == "headItem.define2") {
        continue;
      }
      simpleVOs.push(requestSimpleVOs[i]);
    }
    request.simpleVOs = simpleVOs;
    var strResponse = postman("post", saleorderurl, null, JSON.stringify(request));
    var responseObj = JSON.parse(strResponse);
    return responseObj;
  }
}
exports({ entryPoint: MyAPIHandler });