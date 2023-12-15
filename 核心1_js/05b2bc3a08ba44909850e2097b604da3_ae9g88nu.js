let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //查询质检单明细信息
    let selectBody = {
      check_rowids: [request.childId]
    };
    let apiPreAndAppListCode = extrequire("GT22176AT10.publicFunction.getApiPreAndAppCode").execute();
    let selectUrl = apiPreAndAppListCode.apiPrefix + "/yonbip/imcs/inspectioninfoapi/queryInspectResultDetail";
    let selectApiResponse = openLinker("POST", selectUrl, apiPreAndAppListCode.appCode, JSON.stringify(selectBody));
    selectApiResponse = JSON.parse(selectApiResponse);
    let inspectionInfo = selectApiResponse.data;
    return { inspectionInfo };
  }
}
exports({ entryPoint: MyAPIHandler });