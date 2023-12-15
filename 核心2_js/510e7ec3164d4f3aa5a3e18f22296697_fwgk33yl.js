let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    try {
      //根据高端部门id查询高端部门下员工列表
      var sonsql = ",(select * from high_depart_staffList) sonlist";
      var sql = "select * " + sonsql + " from GT65292AT10.GT65292AT10.high_depart";
      sql += " where id = '" + request.depart_id + "'";
      var res = ObjectStore.queryByYonQL(sql);
      return { res };
    } catch (e) {
      return { e };
    }
  }
}
exports({ entryPoint: MyAPIHandler });