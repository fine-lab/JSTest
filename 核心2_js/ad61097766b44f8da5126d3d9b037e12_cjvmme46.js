let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var customerType = request.customerType;
    var customer = request.customer;
    var productId = request.productId;
    var date = request.reqDate;
    let body = {
      customerType: customerType,
      customer: customer,
      productId: productId,
      reqDate: date
    };
    let header = { "Content-Type": "application/json;charset=UTF-8" };
    let httpUrl = "https://www.example.com/";
    let httpRes = postman("GET", httpUrl, JSON.stringify(header), JSON.stringify(null));
    let httpResData = JSON.parse(httpRes);
    if (httpResData.code != "00000") {
      throw new Error("获取数据中心信息出错" + httpResData.message);
    }
    let func1 = extrequire("SCMSA.jyApi.getToken");
    let res = func1.execute(null);
    let token = res.access_token;
    let url = "https://www.example.com/" + token;
    let resSql = postman("POST", url, JSON.stringify(header), JSON.stringify(body));
    return { resSql };
  }
}
exports({ entryPoint: MyAPIHandler });