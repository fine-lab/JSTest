let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let id = request.id; //请求ID
    let shiyebu = request.bumen; //部门ID
    let shiyebuName = request.bumen_name; //部门名称
    var paramsBody = { id: id, bumen: shiyebu, bumen_name: shiyebuName };
    let rstp = ObjectStore.updateById("AT17DBCECA09580004.AT17DBCECA09580004.FYXPSL", paramsBody);
    return { rstp };
  }
}
exports({ entryPoint: MyAPIHandler });