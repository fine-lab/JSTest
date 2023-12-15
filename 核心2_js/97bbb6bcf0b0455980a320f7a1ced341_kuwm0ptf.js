let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //实施类型
    var ss_type = request.ssType;
    //实施分类
    var ss_class = request.class;
    var sql = "select code,lingyu,application,menu,on_site_day,remote_day,ss_type,applications,customer_value,ss_class from GT6990AT161.GT6990AT161.ss_module where dr = 0 ";
    if (ss_type !== null && ss_type !== undefined && ss_type !== "") {
      sql += " and  ss_type = " + ss_type;
    }
    if (ss_class !== null && ss_class !== undefined && ss_class !== "") {
      sql += " and ss_class = " + ss_class;
    }
    var res = ObjectStore.queryByYonQL(sql);
    return { result: res };
  }
}
exports({ entryPoint: MyAPIHandler });