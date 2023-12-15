let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 获取配置文件的接口请求url
    let envConfigFun = extrequire("GT100035AT154.apenApi.getCurrentConfig");
    let envConfig = envConfigFun.execute(request.envUrl, null);
    let configParas = envConfig.configParas;
    let fun1 = extrequire("GT65230AT76.backDefaultGroup.getApitoken");
    let token = fun1.execute().access_token;
    // 请求体封装
    let body = {
      searchcode: request.telephoen,
      index: 1,
      size: 10,
      sortType: "userMobile"
    };
    let contenttype = "application/json;charset=UTF-8";
    let header = {
      "Content-Type": contenttype
    };
    // 调用接口
    let url = "https://www.example.com/" + token;
    let apiResponse = postman("POST", url, JSON.stringify(header), JSON.stringify(body));
    let res = JSON.parse(apiResponse);
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });