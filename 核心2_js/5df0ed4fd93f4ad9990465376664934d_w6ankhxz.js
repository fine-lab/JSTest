let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 原厂单据 查询 标准版自建单据  可以
    // 原厂单据 查询 原厂单据  ,通过domain可以查询
    var sql = "select code from bd.staff.PsnlCatg ";
    var res = ObjectStore.queryByYonQL(sql, "ucf-staff-center");
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });