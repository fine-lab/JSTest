let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let vendorId = request.vendorId;
    let orgId = request.orgId;
    //获取供应商档案详情
    let apiPreAndAppCode = extrequire("GT22176AT10.publicFunction.getApiPreAndAppCode").execute();
    let menchantQueryUrl = apiPreAndAppCode.apiPrefix + "/yonbip/digitalModel/vendor/detail?id=" + vendorId + "&orgId=" + orgId;
    let apiResponse = openLinker("GET", menchantQueryUrl, apiPreAndAppCode.appCode, null);
    let obj = JSON.parse(apiResponse);
    var merchantInfo;
    if (obj.code == 200) {
      merchantInfo = obj.data;
    } else {
      throw new Error("供应商档案详情查询接口异常" + obj.message);
    }
    return { merchantInfo };
  }
}
exports({ entryPoint: MyAPIHandler });