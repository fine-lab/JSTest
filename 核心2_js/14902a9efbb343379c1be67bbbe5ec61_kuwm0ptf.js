let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取配置文件的接口请求URL
    let envConfigFun = extrequire("GT99666AT149.zhanghu.Config");
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
    let apiResponse = openLinker("POST", url, "GT99666AT149", JSON.stringify(body));
    return {
      apiResponse
    };
  }
}
exports({ entryPoint: MyAPIHandler });