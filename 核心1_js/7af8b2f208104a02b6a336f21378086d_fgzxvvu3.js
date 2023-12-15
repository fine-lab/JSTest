let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let productid = request.productid;
    let orgid = request.orgId;
    //获取到货档案详情
    let info = new Object();
    let apiPreAndAppCode = extrequire("GT22176AT10.publicFunction.getApiPreAndAppCode").execute();
    let menchantQueryUrl = apiPreAndAppCode.apiPrefix + "/yonbip/digitalModel/product/detail?id=" + productid + "&orgId=" + orgid;
    let apiproduct = openLinker("GET", menchantQueryUrl, apiPreAndAppCode.appCode, null);
    apiproduct = JSON.parse(apiproduct);
    if (apiproduct.code == 200) {
      let productInfo = apiproduct.data;
      let detail = productInfo.detail;
      info.stockUnit = detail.stockUnit;
      info.stockUnit_Name = detail.stockUnit_Name;
      info.stockUnit_Precision = detail.stockUnit_Precision;
      info.invExchRate = 1;
      //这里缺少换算率,已经提需求，咱们库存和主计量相同暂时认为是1
    } else {
      throw new Error("计量单位查询接口异常" + apiproduct.message);
    }
    return { info };
  }
}
exports({ entryPoint: MyAPIHandler });