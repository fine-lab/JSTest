let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var pdata = request.data;
    var url = "http://221.1.83.115:7701/bip/receivebip";
    var body = {
      operation: "C",
      billno: ""
    };
    debugger;
    let header = { "Content-type": "application/json" };
    var strResponse = postman("post", url, JSON.stringify(header), JSON.stringify(pdata));
    throw new Error(strResponse);
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });