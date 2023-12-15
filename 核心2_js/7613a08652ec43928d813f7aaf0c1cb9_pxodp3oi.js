let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let id = request.id; //请求ID
    let org_id = request.org_id; //事业部ID
    let org_id_name = request.org_id_name; //事业部名称
    var paramsBody = { id: id, org_id: org_id, org_id_name: org_id_name };
    let rstp = ObjectStore.updateById("AT17DBCECA09580004.AT17DBCECA09580004.YHRB", paramsBody);
    return { rstp };
  }
}
exports({ entryPoint: MyAPIHandler });