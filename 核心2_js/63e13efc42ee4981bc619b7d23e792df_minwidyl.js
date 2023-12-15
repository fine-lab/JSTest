let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var access_token = request.access_token;
    var skucode = request.skucode;
    let suffix = "?" + "access_token=" + access_token;
    let queryCurrentStockUrl = "https://www.example.com/" + suffix;
    //请求头
    var header = { "Content-Type": "application/json" };
    let mode = "POST";
    var body = {
      fields: ["specs"],
      codeList: [skucode],
      defaultSKU: true,
      pageIndex: 1,
      pageSize: 50
    };
    var strResponse = postman(mode, queryCurrentStockUrl, JSON.stringify(header), JSON.stringify(body));
    //返回数据
    return { strResponse };
  }
}
exports({ entryPoint: MyAPIHandler });