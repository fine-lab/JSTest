let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var boo = "";
    const vendorCode = request.vendorCode; //供货供应商ID
    //获取供应商数据（sql语句）
    var sql = "select * from GT22176AT10.GT22176AT10.SY01_fccompauditv4 where supplier = 2490932842762496";
    var res = ObjectStore.queryByYonQL(sql);
    return { sql };
    if (res.length > 0) {
      boo = true;
    } else {
      boo = false;
    }
    return { sql: boo };
  }
}
exports({ entryPoint: MyAPIHandler });