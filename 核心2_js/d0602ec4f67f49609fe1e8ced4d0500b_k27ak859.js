let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let code = "200"; //接口返回状态码
    let msg; //接口返回状态信息
    let msg1; //接口返回状态信
    let sql;
    let dt; //sql查询返回的对象
    let errMsg = "";
    try {
      sql = "SELECT * FROM  pc.product.Product where code = '2100102202116'";
      dt = ObjectStore.queryByYonQL(sql, "udinghuo");
      msg = JSON.stringify(dt);
      sql = "SELECT * FROM aa.product.ProductAssistUnitExchange where productId ='" + dt[0].id + "'";
      dt = ObjectStore.queryByYonQL(sql, "udinghuo");
      msg1 = JSON.stringify(dt);
    } catch (e) {
      code = "999";
      msg = e.toString();
    } finally {
      var res = {
        code: code,
        msg: msg,
        msg1: msg1
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