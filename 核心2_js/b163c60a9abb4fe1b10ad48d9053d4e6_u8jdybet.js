let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    if (!request.businessKey) throw new Error("businessKey不能为空!");
    let body = {
      businessKey: request.businessKey
    };
    let header = {
      "Content-Type": "application/json;charset=UTF-8",
      tenantappsource: "developplatform"
    };
    let responseObj = postman("post", "https://www.example.com/", JSON.stringify(header), JSON.stringify(body));
    let ret = JSON.parse(responseObj);
    return { result: ret };
  }
}
exports({ entryPoint: MyAPIHandler });