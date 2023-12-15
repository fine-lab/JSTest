let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let apiPreAndAppListCode = extrequire("GT22176AT10.publicFunction.getApiPreAndAppCode").execute();
    //到货单保存接口
    let arrivalDetailUrl = apiPreAndAppListCode.apiPrefix + "/yonbip/scm/arrivalorder/singleSave_v1";
    let arrivalDetailRes = openLinker("POST", arrivalDetailUrl, apiPreAndAppListCode.appCode, JSON.stringify(request.updateJson));
    return { arrivalDetailRes };
  }
}
exports({ entryPoint: MyAPIHandler });