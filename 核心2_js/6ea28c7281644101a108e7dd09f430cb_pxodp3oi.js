let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let id = request.id; //请求ID
    let cpmc = request.xqcp; //产品大类ID
    let cpmcName = request.xqcp_productName; //产品大类名称
    var paramsBody = { id: id, xqcp: cpmc, xqcp_productName: cpmcName };
    let rstp = ObjectStore.updateById("GT3734AT5.GT3734AT5.azjfd", paramsBody);
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });