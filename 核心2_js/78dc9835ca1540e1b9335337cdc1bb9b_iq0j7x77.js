let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //使用公共函数--------------begin
    let func1 = extrequire("GT10894AT82.common.getOpenApiToken");
    let res = func1.execute(request);
    let configfun = extrequire("GT10894AT82.common.config");
    let config = configfun.execute(request);
    //使用公共函数--------------end
    var token = res.access_token;
    var deptId = request;
    var requrl = config.config.sandboxopenapiurl + "/yonbip/fi/oap/list?access_token=" + token;
    var header = { "Content-Type": "application/json;charset=UTF-8" };
    var apiData = {
      pageIndex: 1,
      pageSize: 20
    };
    var queryQ = request.queryCondition;
    for (let i in queryQ) {
      apiData[queryQ[i].itemName] = queryQ[i].value1;
    }
    var strResponse = postman("POST", requrl, JSON.stringify(header), JSON.stringify(apiData));
    var responseObj = JSON.parse(strResponse);
    return { responseObj };
  }
}
exports({ entryPoint: MyAPIHandler });