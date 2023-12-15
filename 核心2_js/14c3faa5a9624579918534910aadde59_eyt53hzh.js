let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let apiPreAndAppCode = extrequire("GT22176AT10.publicFunction.getApiPreAndAppCode").execute();
    //查询启用的交易类型
    let body = {
      productId_productApplyRange_orgId: request.orgId,
      pageIndex: "1",
      pageSize: "10000"
    };
    let url = apiPreAndAppCode.apiPrefix + "/yonbip/digitalModel/goodsproductskupro/list";
    let res = openLinker("POST", url, apiPreAndAppCode.appCode, JSON.stringify(body));
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });