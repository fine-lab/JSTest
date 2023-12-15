let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var orgId = request.orgId; //管控组织
    var purCategory = request.purCategory; //采购类别
    var sql = "select * from GT3407AT1.GT3407AT1.ind_budget_rule where org='" + orgId + "' and purCategory='" + purCategory + "' and dr=0";
    var rule = ObjectStore.queryByYonQL(sql, "developplatform");
    return { rule };
  }
}
exports({ entryPoint: MyAPIHandler });