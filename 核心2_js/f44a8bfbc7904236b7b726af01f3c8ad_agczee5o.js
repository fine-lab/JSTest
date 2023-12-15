let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let { url = "", params = {}, method = "post" } = request;
    let appContext = JSON.parse(AppContext());
    // 获取当前环境租户id
    let tenantId = appContext.currentUser.tenantId;
    // 沙箱租户id
    let sandbox_tenantId = "yourIdHere";
    // 生产租户id
    let prod_tenantId = "yourIdHere";
    // 当前环境后端域名地址
    if (sandbox_tenantId == tenantId) {
      url = `https://dbox.yonyoucloud.com/iuap-api-gateway/${tenantId}/commonProductCls/commonProduct/${url}`;
    }
    if (prod_tenantId == tenantId) {
      url = `https://apigateway.yonyoucloud.com/${tenantId}/commonProductCls/commonProduct/${url}`;
    }
    let stringparams = JSON.stringify(params);
    let apiResponse = openLinker(method, url, "SCMSA", JSON.stringify(params));
    let res = JSON.parse(apiResponse);
    return res;
  }
}
exports({ entryPoint: MyAPIHandler });