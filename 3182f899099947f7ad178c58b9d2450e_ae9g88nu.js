let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let address = request.url;
    let startDate = request.startDate;
    let endDate = request.endDate;
    let apiPreAndAppCode = extrequire("GT22176AT10.publicFunction.getApiPreAndAppCode").execute();
    let url = apiPreAndAppCode.apiPrefix + address;
    let body = { pageIndex: 1, pageSize: 99999, isSum: true };
    if (address == "/yonbip/mfg/productionorder/list" || address.indexOf("productionorder") > -1) {
      //生产订单
      let simple = { open_pubts_begin: startDate, open_pubts_end: endDate };
      body.simple = simple;
    } else if (address == "/yonbip/scm/purinrecord/list" || address.indexOf("purinrecord") > -1) {
      //采购入库
      let simpleVOs = [{ field: "vouchdate", op: "between", value1: startDate, value2: endDate }];
      body.simpleVOs = simpleVOs;
    }
    let apiResponse = openLinker("POST", url, apiPreAndAppCode.appCode, JSON.stringify(body));
    return { apiResponse: apiResponse };
  }
}
exports({ entryPoint: MyAPIHandler });