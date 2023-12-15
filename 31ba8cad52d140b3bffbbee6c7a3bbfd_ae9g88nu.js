let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let apiPreAndAppCode = extrequire("GT22176AT10.publicFunction.getApiPreAndAppCode").execute();
    //查询启用的交易类型
    let url = apiPreAndAppCode.apiPrefix + "/yonbip/digitalModel/transtype/queryEnableTranstype?formId=" + request.formId + "&codeName=" + request.codeName;
    let res = openLinker("GET", url, apiPreAndAppCode.appCode, null);
    return { result: res };
  }
}
exports({ entryPoint: MyAPIHandler });