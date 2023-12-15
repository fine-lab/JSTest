let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取当前租户ID
    var res = AppContext();
    var obj = JSON.parse(res);
    var tid = obj.currentUser.tenantId;
    //获取请求参数
    var codeRFID = request.codeRFID;
    var enable = request.enable; //1启用 0停用
    var sql = "SELECT codeRFID,stockCount,fStockCount,GT55021AT2.GT55021AT2.numAuth from  GT55021AT2.GT55021AT2.coderfid";
    var rst = ObjectStore.queryByYonQL(sql);
    if (rst.length > 0) {
      return { status: 1, rst: rst, rstLength: rst.length, request: request };
    }
    return { rst: rst, request: request };
  }
}
exports({ entryPoint: MyAPIHandler });