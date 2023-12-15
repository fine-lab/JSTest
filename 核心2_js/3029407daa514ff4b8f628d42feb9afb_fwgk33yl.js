let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let func1 = extrequire("GT65292AT10.backDefaultGroup.queryStaffInfo");
    let staff = func1.execute({});
    let userId = JSON.parse(staff.apiResponse).data.data[0].user_id;
    var args = '["ea764084-6c48-43b7-8ba7-62a47a767034","fwgk33yl","diwork"]';
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