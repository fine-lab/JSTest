let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let id = request.id;
    let zixiangmu = request.zixiangmu; //询盘需求产品名称
    var object = { id: id, zixiangmu: zixiangmu };
    var res = ObjectStore.updateById("GT3734AT5.GT3734AT5.QYSQD", object, "d589f47a");
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });