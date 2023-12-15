let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 获取对象的字符串
    var table = request.table;
    var billNum = request.billNum;
    var list = request.list;
    var res = ObjectStore.deleteBatch(table, list, billNum);
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });