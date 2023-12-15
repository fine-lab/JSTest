let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var code = "200"; //接口返回状态码
    var msg; //接口返回状态信息
    var sql;
    var dt; //sql查询返回的对象
    var errMsg = "";
    try {
      msg = "0";
      if (request.data.productId != "undefined") {
        sql = "SELECT cankaojia FROM AT163BD39E08680003.AT163BD39E08680003.kehucankaojia where shangpinbianma=  '" + request.data.productId + "'";
        dt = ObjectStore.queryByYonQL(sql);
        if (dt.length != 0) {
          msg = dt[0].cankaojia;
        }
      }
      if (request.data.productId != "undefined" && request.data.customerClass != "undefined") {
        sql =
          "SELECT cankaojia FROM AT163BD39E08680003.AT163BD39E08680003.kehucankaojia where shangpinbianma=  '" + request.data.productId + "' and kehufenleibianma='" + request.data.customerClass + "'";
        dt = ObjectStore.queryByYonQL(sql);
        if (dt.length != 0) {
          msg = dt[0].cankaojia;
        }
      }
      if (request.data.productId != "undefined" && request.data.customerID != "undefined") {
        sql = "SELECT cankaojia FROM AT163BD39E08680003.AT163BD39E08680003.kehucankaojia where shangpinbianma=  '" + request.data.productId + "' and kehubianma='" + request.data.customerID + "'";
        dt = ObjectStore.queryByYonQL(sql);
        if (dt.length != 0) {
          msg = dt[0].cankaojia;
        }
      }
    } catch (e) {
      code = "999";
      msg = e.toString();
    } finally {
      var res = {
        code: code,
        msg: msg
      };
      return {
        res
      };
    }
  }
}
exports({
  entryPoint: MyAPIHandler
});