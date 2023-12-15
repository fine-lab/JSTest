let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var orgId = request.orgId; //管控组织
    var controlObject = request.controlObject; //管控对象
    var sql = "select * from GT3407AT1.GT3407AT1.ind_budget_rule where org='" + orgId + "' and controlObject='" + controlObject + "'";
    var rule = ObjectStore.queryByYonQL(sql, "developplatform");
    return { rule };
  }
}
exports({ entryPoint: MyAPIHandler });