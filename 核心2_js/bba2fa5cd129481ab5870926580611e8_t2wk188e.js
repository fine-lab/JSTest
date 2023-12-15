let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var billdate = request.billdate;
    var ware_id = request.ware_id;
    var access_token = request.access_token;
    let suffix = "?" + "access_token=" + access_token;
    let mode = "POST";
    let queryCurrentStockUrl = "https://www.example.com/" + suffix;
    let queryCurrentStockParam = { warehouse: ware_id };
    //请求头
    var header = { "Content-Type": "application/json" };
    var strResponse = postman(mode, queryCurrentStockUrl, JSON.stringify(header), JSON.stringify(queryCurrentStockParam));
    //返回数据
    return { strResponse };
  }
}
exports({ entryPoint: MyAPIHandler });