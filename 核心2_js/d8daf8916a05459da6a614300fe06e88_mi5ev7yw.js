let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let apiPreAndAppListCode = extrequire("GT22176AT10.publicFunction.getApiPreAndAppCode").execute();
    //获取委外到货单详细信息
    let outSourcingDetailUrl = apiPreAndAppListCode.apiPrefix + "/yonbip/mfg/arriveorder/detail?id=" + request.outSourcingId;
    let outSourcingDetailRes = openLinker("GET", outSourcingDetailUrl, apiPreAndAppListCode.appCode, null);
    outSourcingDetailRes = JSON.parse(outSourcingDetailRes);
    let outSourcingDetailData = outSourcingDetailRes.data;
    return { outSourcingDetailData };
  }
}
exports({ entryPoint: MyAPIHandler });