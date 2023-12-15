let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var id = request.id;
    var pubts = request.pubts;
    // 注意事件戳(必须和数据库的一致、否则提示网络上有其他人操作或者已经关闭等错误提示)
    var object = { id: id, dizhi: "2578590844983042" };
    var retobj = ObjectStore.updateById("GT46349AT1.GT46349AT1.salebaojai", object);
    return { retobj };
  }
}
exports({
  entryPoint: MyAPIHandler
});