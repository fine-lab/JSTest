let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //信息头
    let header = {
      "Content-Type": "application/json;charset=utf-8"
    };
    //信息体
    let body = { account: request.account, tenantId: request.tenantId };
    var responseObj = postman("post", "https://www.example.com/", JSON.stringify(header), JSON.stringify(body));
    var res = JSON.parse(responseObj);
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });