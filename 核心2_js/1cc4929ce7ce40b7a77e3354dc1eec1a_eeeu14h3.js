let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var access_token = request.access_token;
    var warehouseId = request.warehouseId;
    let suffix = "?" + "access_token=" + access_token + "&id=" + warehouseId;
    let queryCurrentStockUrl = "https://www.example.com/" + suffix;
    //请求头
    var header = { "Content-Type": "application/json" };
    let mode = "get";
    var strResponse = postman(mode, queryCurrentStockUrl, JSON.stringify(header), null);
    //返回数据
    return { strResponse };
  }
}
exports({ entryPoint: MyAPIHandler });