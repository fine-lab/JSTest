let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取配置文件的接口请求url
    let envConFigFun = extrequire("GT2841AT10.openapiAPP.getUserName");
    let envConfig = envConFigFun.execute(request.envUrl).configParams;
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
    let apiResponse = openLinker("POST", url, "", JSON.stringify(body));
    return { apiResponse };
  }
}
exports({ entryPoint: MyAPIHandler });