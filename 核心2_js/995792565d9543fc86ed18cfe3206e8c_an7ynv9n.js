let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var url = "http://172.16.106.247:80/servlet/masterOrgQuery";
    var body = {};
    var header = {};
    var strResponse = postman("post", url, header, body);
    return { strResponse };
  }
}
exports({ entryPoint: MyAPIHandler });