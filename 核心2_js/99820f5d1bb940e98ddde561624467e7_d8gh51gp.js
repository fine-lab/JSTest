let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var id = request.id;
    //依据检测订单主键查询主表
    var querBodyz = "select * from  AT15F164F008080007.AT15F164F008080007.DetectOrder where id='" + id + "'";
    var bodyResz = ObjectStore.queryByYonQL(querBodyz, "developplatform");
    var data = bodyResz[0];
    return { data };
  }
}
exports({ entryPoint: MyAPIHandler });