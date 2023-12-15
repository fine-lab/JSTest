let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var code = "200"; //接口返回状态码
    var msg; //接口返回状态信息
    var sql;
    var dt; //sql查询返回的对象
    var errMsg = "";
    try {
      sql = "SELECT shangpinbianma FROM AT163BD39E08680003.AT163BD39E08680003.shangpindangan WHERE shangpinbianma= '" + request.data.productId + "'";
      dt = ObjectStore.queryByYonQL(sql);
      if (dt.length == 0) {
        msg = "200";
      } else {
        msg = "900";
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