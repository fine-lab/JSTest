let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var header = { "Content-Type": "application/json;charset=UTF-8" };
    //获取配置文件的接口请求url
    let envConfigFun = extrequire("GT100036AT155.openapi.getCurrentEnvCf");
    let envConfig = envConfigFun.execute(request.envUrl).configParams;
    let url = envConfig.apiurl.users;
    //请求体封装
    var pageIndex = "1";
    var pageSize = "100";
    let body = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      searchcode: request.telephone
    };
    //调用接口
    //注意填写应用编码
    var strResponse = postman("POST", url, JSON.stringify(header), JSON.stringify(body));
    var apiResponse = JSON.parse(strResponse);
    return {
      apiResponse
    };
  }
}
exports({ entryPoint: MyAPIHandler });