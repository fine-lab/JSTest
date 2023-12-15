let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 获取友互通用户Id
    let { yhtUserId, serviceCode, tenantId } = request;
    function getconfig() {
      return {
        appId: "yourIdHere",
        uri: "/yonbip/digitalModel/mainOrgPermission",
        method: "post",
        body: {
          userId: yhtUserId,
          serviceCode,
          tenantId
        }
      };
    }
    let config = getconfig();
    let func = extrequire("GT53685AT3.common.baseOpenApi");
    let res = func.execute(config).res;
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });