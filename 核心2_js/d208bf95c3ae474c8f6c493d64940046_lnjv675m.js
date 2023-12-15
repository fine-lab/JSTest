let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let { ids } = request;
    function getconfig() {
      return {
        appId: "yourIdHere",
        uri: "/yonbip/digitalModel/querySuperiorOrgInfos",
        method: "post",
        body: {
          funcType: "adminorg",
          ids,
          // 包含本节点
          includeCurrent: true
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