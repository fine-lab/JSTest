let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //实体查询
    var res = ObjectStore.selectBatchIds(request.url, request.object, request.billNo);
    return { data: res };
  }
}
exports({ entryPoint: MyAPIHandler });