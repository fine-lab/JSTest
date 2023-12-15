let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 查询SQL
    var managerSql =
      "select inspect_record,inspectors.name, inspect_organization.name, inspect_department.name,inspect_time,inspect_result  from GT65927AT11.GT65927AT11.patrol    where patrol_name = '" +
      request.patrol_id +
      "'";
    var res = ObjectStore.queryByYonQL(managerSql);
    return {
      res: res
    };
  }
}
exports({ entryPoint: MyAPIHandler });