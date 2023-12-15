let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let staffPk = request.staffPk; // 员工pk
    let sql = "select pk_belong_project from GT84651AT2.GT84651AT2.pdm_project_member where pk_member='" + staffPk + "'";
    var res = ObjectStore.queryByYonQL(sql);
    return { returnData: res };
  }
}
exports({ entryPoint: MyAPIHandler });