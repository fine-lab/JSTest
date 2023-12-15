let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取接口调用地址
    console.log(request);
    let envConfigFun = extrequire("AT164B201408C00003.backOpenApiFunction.getEnv");
    request.apiurlKey = "yourKeyHere";
    let envConfig = envConfigFun.execute(request);
    let url = envConfig.url;
    //接口传参
    var pageIndex = "1";
    var pageSize = "100";
    let body = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      salesOrg: request.params.org_id
    };
    var salesDelegateDefaultData;
    //执行接口调用
    let apiResponse = openLinker("POST", url, envConfig.appcode, JSON.stringify(body));
    apiResponse = JSON.parse(apiResponse);
    if (apiResponse.data === undefined || apiResponse.data === null) return;
    //判断如果存在多条记录，取默认值
    if (apiResponse.data.recordCount > 0) {
      for (let index = 0; index < apiResponse.data.recordCount; index++) {
        let currentData = apiResponse.data.recordList[index];
        if (currentData.isDefault == 1) {
          salesDelegateDefaultData = currentData;
          break;
        }
      }
    }
    return { salesDelegateDefaultData };
  }
}
exports({ entryPoint: MyAPIHandler });