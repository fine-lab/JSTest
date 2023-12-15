let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let apiPreAndAppListCode = extrequire("GT22176AT10.publicFunction.getApiPreAndAppCode").execute();
    //获取到货单详细信息
    let arrivalDetailUrl = apiPreAndAppListCode.apiPrefix + "/yonbip/scm/arrivalorder/detail?id=" + request.arrivaId;
    let arrivalDetailRes = openLinker("GET", arrivalDetailUrl, apiPreAndAppListCode.appCode, null);
    arrivalDetailRes = JSON.parse(arrivalDetailRes);
    let arrivalDetailData = arrivalDetailRes.data;
    return { arrivalDetailData };
  }
}
exports({ entryPoint: MyAPIHandler });