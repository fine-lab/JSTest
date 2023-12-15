let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 产品
    var pageindex = request.data.pageindex;
    var pageSize = request.data.pageSize;
    var sql =
      "select id,Receivingdate,the_client_code,(select a.id,a.registration_number,a.batch_number,a.product_code,batch_number from product_lisList as a where a.dr=0) from AT161E5DFA09D00001.AT161E5DFA09D00001.WarehousingAcceptanceSheet  where dr = 0 limit " +
      pageindex +
      "," +
      pageSize +
      "";
    var result = ObjectStore.queryByYonQL(sql, "developplatform");
    return { result };
  }
}
exports({ entryPoint: MyAPIHandler });