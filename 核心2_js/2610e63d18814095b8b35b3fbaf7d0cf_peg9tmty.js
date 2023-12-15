let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var sku = request.sku;
    var batchNbr = request.number;
    var clientCode = request.clientCode;
    let body = {};
    let reqUrl = "https://www.example.com/" + clientCode + "/" + sku + "/" + batchNbr + "";
    let ContentType = "text/plain;charset=UTF-8";
    let header = { "Content-Type": ContentType };
    let strResponse = postman("get", reqUrl, JSON.stringify(header), JSON.stringify(body));
    var str = JSON.parse(strResponse);
    return { str };
  }
}
exports({ entryPoint: MyAPIHandler });