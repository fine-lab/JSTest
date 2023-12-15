let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let userId = JSON.parse(AppContext()).currentUser.id;
    var args = '["' + userId + '","l8av6dvt","diwork"]';
    let body = {
      url: "https://www.example.com/",
      accessKey: "yourKeyHere",
      accessSecret: "yourSecretHere",
      args: args,
      methodName: "findRolesByUserId",
      serviceName: "com.yonyou.uap.tenant.service.itf.ITenantRoleUserService"
    };
    var strResponse = postman("post", "https://www.example.com/", null, JSON.stringify(body));
    return { strResponse: strResponse, staff: staff };
  }
}
exports({ entryPoint: MyAPIHandler });