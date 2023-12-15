let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var id = request.id; // 主键
    var documents_code = request.documents_code; // 单据编号
    var goods_date = request.goods_date; // 交货日期
    var documents_date = request.documents_date; //单据日期
    if (id != null) {
      var object = { id: id };
      var res = ObjectStore.selectByMap("GT83441AT1.GT83441AT1.Futuregoods", object);
    } else if (documents_code != null) {
      var object = { documents_code: documents_code };
      var res = ObjectStore.selectByMap("GT83441AT1.GT83441AT1.Futuregoods", object);
    } else if (goods_date != null) {
      var object = { goods_date: goods_date };
      var res = ObjectStore.selectByMap("GT83441AT1.GT83441AT1.Futuregoods", object);
    } else if (documents_date != null) {
      var object = { documents_date: documents_date };
      var res = ObjectStore.selectByMap("GT83441AT1.GT83441AT1.Futuregoods", object);
    } else {
      var res = ObjectStore.queryByYonQL(" select * from GT83441AT1.GT83441AT1.Futuregoods where dr=0");
    }
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });