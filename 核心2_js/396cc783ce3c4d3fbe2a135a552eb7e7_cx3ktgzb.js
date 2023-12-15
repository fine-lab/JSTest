let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    try {
      var pdata = request.data;
      var url = "http://221.1.83.115:6669/service/ReceiveBIPServlet";
      var body = {
        operation: "C",
        billno: ""
      };
      debugger;
      let header = { "Content-type": "application/json" };
      var strResponse = postman("post", url, JSON.stringify(header), JSON.stringify(pdata));
    } catch (e) {
      throw new Error(e + url);
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });