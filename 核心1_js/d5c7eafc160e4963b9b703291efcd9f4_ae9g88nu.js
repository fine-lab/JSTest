let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let vendorId = request.vendorId;
    let vendorApplyRangeId = request.vendorApplyRangeId; //使用组织ID
    //获取供应商档案详情
    let apiPreAndAppCode = extrequire("GT22176AT10.publicFunction.getApiPreAndAppCode").execute();
    let menchantQueryUrl = apiPreAndAppCode.apiPrefix + "/yonbip/digitalModel/vendor/detail?id=" + vendorId + "&vendorApplyRangeId=" + vendorApplyRangeId;
    let apiResponse = openLinker("GET", menchantQueryUrl, apiPreAndAppCode.appCode, null);
    let obj = JSON.parse(apiResponse);
    var vendorInfo;
    if (obj.code == 200) {
      vendorInfo = obj.data;
    } else {
      throw new Error("供应商档案详情查询接口异常" + obj.message);
    }
    return { vendorInfo: vendorInfo };
  }
}
exports({ entryPoint: MyAPIHandler });