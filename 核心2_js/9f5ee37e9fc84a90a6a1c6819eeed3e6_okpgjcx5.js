let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    debugger;
    // 开票类别
    var organisationcode = request.code;
    // 开票类别
    var uri = "GT21859AT11.GT21859AT11.kaipiaoleibiednagan";
    // 查询
    var sql = "select * from " + uri + " where organisationcode = '" + request.code + "'";
    var res = ObjectStore.queryByYonQL(sql);
    // 删除
    var object = { id: res[0].id, subTable: [{ id: res[0].id }] };
    var res = ObjectStore.deleteById(uri, object, organisationcode);
    return { request: request };
  }
}
exports({ entryPoint: MyAPIHandler });