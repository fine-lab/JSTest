let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let func1 = extrequire("GT79203AT15.common.getOpenApiToken");
    let res = func1.execute(request);
    let configfun = extrequire("GT79203AT15.common.config");
    let config = configfun.execute(request);
    //使用公共函数--------------end
    var token = res.access_token;
    //信息体
    let body = {
      systemCode: "diwork",
      tenantId: "yourIdHere"
    };
    //信息头
    let header = {
      "Content-Type": "application/json;charset=UTF-8"
    };
    let apiResponse = postman("post", "https://www.example.com/" + token, JSON.stringify(header), JSON.stringify(body));
    return {
      apiResponse
    };
  }
}
exports({ entryPoint: MyTrigger });