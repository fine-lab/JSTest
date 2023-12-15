let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var sql = " select * from GT87848AT43.GT87848AT43.supplier0411 where id in (select supplier from GT87848AT43.GT87848AT43.supplierbankacc0411 where id='" + request.supplierbankaccid + "')";
    //查询内容
    var res = ObjectStore.queryByYonQL(sql);
    if (res != null && res.length > 0) {
      return { data: res[0] };
    } else {
      return { data: null };
    }
  }
}
exports({ entryPoint: MyAPIHandler });