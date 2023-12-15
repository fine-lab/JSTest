let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let supperId = request;
    //获取质量复查主表信息
    //获取到货档案详情
    let apiPreAndAppCode = extrequire("GT22176AT10.publicFunction.getApiPreAndAppCode").execute();
    let menchantQueryUrl = apiPreAndAppCode.apiPrefix + "/yonbip/scm/arrivalorder/detail?id=" + supperId;
    let apiResponse = openLinker("GET", menchantQueryUrl, apiPreAndAppCode.appCode, null);
    apiResponse = JSON.parse(apiResponse);
    var merchantInfo;
    if (apiResponse.code == 200) {
      merchantInfo = apiResponse.data;
    } else {
      throw new Error("到货单详情查询接口异常" + apiResponse.message);
    }
    return { merchantInfo };
  }
}
exports({ entryPoint: MyAPIHandler });