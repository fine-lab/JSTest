let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let productId = request.productId;
    let productApplyRangeId = request.productApplyRangeId; //使用组织ID
    //获取供应商档案详情
    let apiPreAndAppCode = extrequire("GT22176AT10.publicFunction.getApiPreAndAppCode").execute();
    let menchantQueryUrl = apiPreAndAppCode.apiPrefix + "/yonbip/digitalModel/product/detail?id=" + productId + "&productApplyRangeId=" + productApplyRangeId;
    let apiResponse = openLinker("GET", menchantQueryUrl, apiPreAndAppCode.appCode, null);
    let obj = JSON.parse(apiResponse);
    var productInfo;
    if (obj.code == 200) {
      productInfo = obj.data;
    } else {
      throw new Error("物料档案详情查询接口异常" + JSON.stringify(apiResponse));
    }
    return { productInfo: productInfo };
  }
}
exports({ entryPoint: MyAPIHandler });