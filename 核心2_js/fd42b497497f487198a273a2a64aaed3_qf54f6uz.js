let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var vbillcode = request.vbillcode;
    let body = { bipvbillcode: vbillcode };
    let header = { "Content-Type": "application/json;charset=UTF-8" };
    let strResponse = postman("post", "http://117.27.93.189:38888/uapws/rest/saleorder/resource/QueryKtckData", JSON.stringify(header), JSON.stringify(body));
    let obj = JSON.parse(strResponse);
    return { obj };
  }
}
exports({ entryPoint: MyAPIHandler });