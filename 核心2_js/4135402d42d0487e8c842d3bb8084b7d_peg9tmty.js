let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 产品编码
    var code = request.code;
    // 生产批号
    var number = request.number;
    let ContentType = "text/plain;charset=UTF-8";
    let header = { "Content-Type": ContentType };
    let body = {
      SKU: code,
      BATCH_NBR: number
    };
    let strResponse = postman("POST", "https://www.example.com/", null, JSON.stringify(body));
    var res = JSON.parse(strResponse);
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });