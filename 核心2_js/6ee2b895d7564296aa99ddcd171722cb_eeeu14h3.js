let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取当前环境的配置信息函数
    let envConfigFun = extrequire("AT1598793A09B00005.openAPI.getCurrEnvConfig");
    let envConfig = envConfigFun.execute(request.envUrl).configParams;
    let url = envConfig.apiurl.salesDelegate;
    var pageIndex = "1";
    //公有云的客开项目一般不会存在大量的委托关系，如果确实出现了，
    //也不应该递归调用接口去查找默认委托关系，请提交工单接口支持传【是否默认】参数进行过滤
    //此处默认只查找至多100条数据
    var pageSize = "100";
    let body = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      salesOrg: request.params.org_id
    };
    var salesDelegateDefaultData;
    let apiResponse = openLinker("POST", url, envConfig.appcode, JSON.stringify(body));
    apiResponse = JSON.parse(apiResponse);
    if (apiResponse.data === undefined || apiResponse.data === null) return;
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