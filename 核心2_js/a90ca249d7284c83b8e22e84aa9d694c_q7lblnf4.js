let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //查询内容
    var queryObject = { id: request.id };
    //实体查询
    var queryRes = ObjectStore.selectById("GT74708AT36.GT74708AT36.jixiezulinhetong2", queryObject);
    var leiji = queryRes.leijijiesuanjine;
    var object = { id: request.id, leijijiesuanjine: request.leijijiesuanjine + leiji };
    var res = ObjectStore.updateById("GT74708AT36.GT74708AT36.jixiezulinhetong2", object, "GT74708AT36");
    return { leiji: request.leijijiesuanjine + leiji };
  }
}
exports({ entryPoint: MyAPIHandler });