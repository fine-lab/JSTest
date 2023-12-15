let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let unit = request.unit;
    //获取到货档案详情
    let apiPreAndAppCode = extrequire("GT22176AT10.publicFunction.getApiPreAndAppCode").execute();
    let QueryUrl = apiPreAndAppCode.apiPrefix + "/yonbip/digitalModel/unit/detail?id=" + unit;
    let apiResponse = openLinker("GET", QueryUrl, apiPreAndAppCode.appCode, null);
    apiResponse = JSON.parse(apiResponse);
    var unitInfo;
    if (apiResponse.code == 200) {
      unitInfo = apiResponse.data;
    } else {
      throw new Error("计量单位查询接口异常" + apiResponse.message);
    }
    return { unitInfo };
  }
}
exports({ entryPoint: MyAPIHandler });