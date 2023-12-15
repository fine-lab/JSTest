let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var pdata = request.data;
    var url = "http://221.1.83.115:6669/bip/receivebip";
    var body = {
      operation: "C",
      billno: ""
    };
    let header = { "Content-type": "application/json" };
    var strResponse = postman("post", url, JSON.stringify(header), JSON.stringify(pdata));
    var response = JSON.parse(strResponse);
    return { response };
  }
}
exports({ entryPoint: MyAPIHandler });