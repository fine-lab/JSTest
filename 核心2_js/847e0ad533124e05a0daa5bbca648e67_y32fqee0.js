let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var sku = request.sku;
    var batchNbr = request.batchNbr;
    var clientCode = request.clientCode;
    let body = {};
    let reqUrl = "https://www.example.com/" + clientCode + "/" + sku + "/" + batchNbr + "";
    let ContentType = "text/plain;charset=UTF-8";
    let header = { "Content-Type": ContentType };
    let strResponse = postman("get", reqUrl, JSON.stringify(header), JSON.stringify(body));
    return { strResponse };
  }
}
exports({ entryPoint: MyAPIHandler });