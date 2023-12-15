let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let id = request.id; //请求ID
    let shgcs = request.shgcs; //工程师ID
    let shgcs_name = request.shgcs_name; //工程师名称
    var paramsBody = { id: id, shgcs: shgcs, shgcs_name: shgcs_name };
    let rstp = ObjectStore.updateById("AT17854C0208D8000B.AT17854C0208D8000B.shwtfk", paramsBody);
    return { rstp };
  }
}
exports({ entryPoint: MyAPIHandler });