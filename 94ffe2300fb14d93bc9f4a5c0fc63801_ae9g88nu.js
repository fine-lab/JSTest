let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let productId = request.materialId;
    let orgId = request.orgId;
    let apiPreAndAppCode = extrequire("GT22176AT10.publicFunction.getApiPreAndAppCode").execute();
    //获取物料档案详情
    let menchantQueryUrl = apiPreAndAppCode.apiPrefix + "/yonbip/digitalModel/product/detail?id=" + productId + "&orgId=" + orgId;
    let apiResponse = openLinker("GET", menchantQueryUrl, apiPreAndAppCode.appCode, null);
    apiResponse = JSON.parse(apiResponse);
    var merchantInfo;
    if (apiResponse.code == 200) {
      merchantInfo = apiResponse.data;
    } else {
      throw new Error("物料档案详情查询接口异常" + apiResponse.message);
    }
    return { merchantInfo };
  }
}
exports({ entryPoint: MyAPIHandler });