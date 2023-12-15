let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 获取当前任务的租户ID
    let tenantid = ObjectStore.env().tenantId;
    return { result: request };
  }
}
exports({ entryPoint: MyAPIHandler });