let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let url = "http://172.16.106.247:80/servlet/masterOrgQuery";
    let body = {
      begindate: "2022-03-03 00:00:00"
    };
    let header = {};
    var strResponse = postman("post", url, JSON.stringify(header), JSON.stringify(body));
    return { strResponse };
  }
}
exports({ entryPoint: MyAPIHandler });