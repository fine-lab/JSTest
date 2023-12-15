let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //使用公共函数--------------begin
    let func1 = extrequire("GT79203AT15.common.getOpenApiToken");
    let res = func1.execute(request);
    let configfun = extrequire("GT79203AT15.common.config");
    let config = configfun.execute(request);
    //使用公共函数--------------end
    var token = res.access_token;
    var requrl = config.config.sandboxopenapiurl + "/yonbip/digitalModel/role/getTenantRoles?access_token=" + token;
    var header = { "Content-Type": "application/json;charset=UTF-8" };
    var apiData = {
      systemCode: "diwork",
      tenantId: "yourIdHere"
    };
    var strResponse = postman("POST", requrl, JSON.stringify(header), JSON.stringify(apiData));
    var responseObj = JSON.parse(strResponse);
    return { responseObj };
  }
}
exports({ entryPoint: MyAPIHandler });