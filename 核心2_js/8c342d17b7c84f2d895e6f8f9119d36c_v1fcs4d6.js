let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let pageIndex = request.pageIndex; //页码
    let pageSize = request.pageSize; //每页数量
    let pageCount = 0; //分页总数
    let sql = "select * from aa.merchant.Merchant";
    var data = ObjectStore.queryByYonQL(sql, "ustock");
    return { data };
  }
}
exports({ entryPoint: MyAPIHandler });