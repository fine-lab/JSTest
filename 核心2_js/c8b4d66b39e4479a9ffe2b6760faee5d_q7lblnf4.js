let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //查询内容
    var queryObject = { id: request.id };
    //实体查询
    var queryRes = ObjectStore.selectById("GT67865AT3.GT67865AT3.fenbaohetongzibiao", queryObject);
    var leiji = queryRes.leijijiesuanjine;
    var object = { id: request.id, leijijiesuanjine: request.jiesuanjine + leiji };
    var res = ObjectStore.updateById("GT67865AT3.GT67865AT3.fenbaohetongzibiao", object, "GT67865AT3");
    return { leiji: request.jiesuanjine + leiji };
  }
}
exports({ entryPoint: MyAPIHandler });