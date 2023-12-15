let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let { taskName } = request;
    if (!taskName) {
      throw new Error("任务名称不能为空！！！");
    }
    let appContext = JSON.parse(AppContext());
    let currentUser = appContext.currentUser;
    let header_info = {
      userId: currentUser.id,
      tenantId: currentUser.tenantId,
      yht_access_token: appContext.token
    };
    let body_info = {};
    // 获取当前环境租户id
    let tenantId = appContext.currentUser.tenantId;
    // 沙箱租户id
    let sandbox_tenantId = "yourIdHere";
    // 生产租户id
    let prod_tenantId = "yourIdHere";
    let appUrl;
    // 当前环境后端域名地址
    if (sandbox_tenantId == tenantId) {
      appUrl = `https://isv-dev.yonisv.com/yonbip-yisv-isy-ex-dev-be`; // 新域名
    }
    if (prod_tenantId == tenantId) {
      appUrl = `https://shangyao-ex-prod.yonisv.com/be`;
    }
    let strResponse = postman("get", `${appUrl}/functionApi/exec?funServiceName=${taskName}`, JSON.stringify(header_info), JSON.stringify(body_info));
    return JSON.parse(strResponse);
  }
}
exports({ entryPoint: MyAPIHandler });