let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let apiPreAndAppListCode = extrequire("GT22176AT10.publicFunction.getApiPreAndAppCode").execute();
    //获取完工报告单详细信息
    let finishedDetailUrl = apiPreAndAppListCode.apiPrefix + "/yonbip/mfg/finishedreport/detail?id=" + request.finishedId;
    let finishedDetailRes = openLinker("GET", finishedDetailUrl, "ISY_2", null);
    finishedDetailRes = JSON.parse(finishedDetailRes);
    let finishedDetailData = finishedDetailRes.data;
    return { finishedDetailData };
  }
}
exports({ entryPoint: MyAPIHandler });