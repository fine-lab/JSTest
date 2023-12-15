let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取配置文件的接口请求url
    let url = envConfig.apiurl.users;
    //请求体封装
    var pageIndex = "1";
    var pageSize = "100";
    let body = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      searchCode: request.telephone
    };
    //调用接口
    let apiResponse = openLinker("POST", url, "GT99600AT147", JSON.stringify(body));
    throw new Error("error!!!!");
    return {
      apiResponse
    };
  }
}
exports({ entryPoint: MyAPIHandler });