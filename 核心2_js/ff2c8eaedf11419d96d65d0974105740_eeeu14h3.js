let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var access_token = request.access_token;
    var product_id = request.product_id;
    var org_id = request.org_id;
    let suffix = "?" + "access_token=" + access_token;
    let mode = "POST";
    let queryCurrentStockUrl = "https://www.example.com/" + suffix;
    let queryCurrentStockParam = { org: org_id };
    //请求头
    var header = { "Content-Type": "application/json" };
    var strResponse = postman(mode, queryCurrentStockUrl, JSON.stringify(header), JSON.stringify(queryCurrentStockParam));
    //返回数据
    return { strResponse };
  }
}
exports({ entryPoint: MyAPIHandler });