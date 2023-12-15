let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let address = request.url;
    let startDate = request.startDate;
    let endDate = request.endDate;
    let apiPreAndAppCode = extrequire("I0P_UDI.publicFunction.getApiPreAndApp").execute();
    let url = apiPreAndAppCode.apiPrefix + address;
    let body = { pageIndex: 1, pageSize: 99999, isSum: true };
    if (address == "/yonbip/mfg/productionorder/list" || address.indexOf("productionorder") > -1) {
      //生产订单
      let simple = { open_pubts_begin: startDate, open_pubts_end: endDate };
      body.simple = simple;
      body.status = 1;
    } else if (address == "/yonbip/scm/purinrecord/list" || address.indexOf("purinrecord") > -1) {
      //采购入库
      let simpleVOs = [
        { field: "vouchdate", op: "between", value1: startDate, value2: endDate },
        { field: "purInRecords.qty", op: "gt", value1: "0" },
        { field: "status", op: "eq", value1: "1" }
      ];
      body.simpleVOs = simpleVOs;
    } else if (address == "/yonbip/scm/storeprorecord/list" || address.indexOf("storeprorecord") > -1) {
      //产品入库列表查询
      let simpleVOs = [
        { field: "vouchdate", op: "between", value1: startDate, value2: endDate },
        { field: "storeProRecords.qty", op: "gt", value1: "0" },
        { field: "status", op: "eq", value1: "1" }
      ];
      body.simpleVOs = simpleVOs;
    }
    let apiResponse = openLinker("POST", url, apiPreAndAppCode.appCode, JSON.stringify(body));
    return { apiResponse: apiResponse };
  }
}
exports({ entryPoint: MyAPIHandler });