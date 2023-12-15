let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let func1 = extrequire("GT100265AT156.getnum.getToken");
    let res = func1.execute();
    let url = "https://www.example.com/";
    var token = res.access_token;
    //请求体封装
    let body = {
      product: request.productId
    };
    let header = {
      "Content-Type": "application/json;charset=UTF-8"
    };
    var strResponse = postman("get", url, JSON.stringify(header), null);
    let message = JSON.parse(strResponse);
    if (message.code == "00000") {
      let urlInfo = message.data.gatewayUrl;
      let urlnum = urlInfo + "/yonbip/scm/stock/QueryCurrentStocksByCondition?access_token=" + token;
      var strResponse1 = postman("POST", urlnum, JSON.stringify(header), JSON.stringify(body));
      return {
        strResponse1
      };
    } else {
    }
    return {
      strResponse
    };
  }
}
exports({ entryPoint: MyAPIHandler });