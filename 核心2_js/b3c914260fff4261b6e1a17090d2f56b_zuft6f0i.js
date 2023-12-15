let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let rsp = {
      code: "200",
      msg: "",
      dataInfo: ""
    };
    let vendorid = request.vendorid; //供应商
    let StoreCode = request.StoreCode; //门店代码
    try {
      let sql = "select AccountNo,id from AT1767B4C61D580001.AT1767B4C61D580001.SupplierAccount where vendor='" + vendorid + "' and StoreCode='" + StoreCode + "'";
      var res = ObjectStore.queryByYonQL(sql, "developplatform");
      if (res.length > 0) {
        rsp.dataInfo = res[0];
      } else {
        rsp.code = 500;
        rsp.msg = "未配置供应商账户";
      }
    } catch (ex) {
      rsp.code = 500;
      rsp.msg = ex.message;
    }
    return rsp;
  }
}
exports({ entryPoint: MyAPIHandler });