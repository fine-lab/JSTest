let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let url = request.url || "";
    // 当前上下文信息
    let res = JSON.parse(AppContext());
    // 获取当前环境租户id
    let tenantId = res.currentUser.tenantId;
    // 沙箱租户id
    let sandbox_tenantId = "yourIdHere";
    // 生产租户id
    let prod_tenantId = "yourIdHere";
    // 当前环境后端域名地址
    if (sandbox_tenantId == tenantId) {
      url = `https://dbox.diwork.com/iuap-api-gateway/${tenantId}/commonProductCls/commonProduct/${url}`;
    }
    if (prod_tenantId == tenantId) {
      url = `https://api.diwork.com/${tenantId}/commonProductCls/commonProduct/${url}`;
    }
    return { url };
  }
}
exports({ entryPoint: MyAPIHandler });