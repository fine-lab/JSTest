let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var data = request.data;
    var sql = "select materialId from GT75537AT42.GT75537AT42.Purchaseordedetail ";
    //实体查询
    var res = ObjectStore.queryByYonQL(sql);
    return { data: "success" };
  }
}
exports({ entryPoint: MyAPIHandler });