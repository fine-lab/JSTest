let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    try {
      let vendorid = request.vendorid; //账户id
      let StoreCode = request.StoreCode; //门店编码
      var res; //返回信息
      var rsp = {
        code: 0,
        msg: "调用ys接口成功"
      };
      let sql = "select AccountNo,id from AT1767B4C61D580001.AT1767B4C61D580001.SupplierAccount where vendor='" + vendorid + "' and StoreCode='" + StoreCode + "'";
      var res = ObjectStore.queryByYonQL(sql);
      if (res.length > 0) {
        rsp["data"] = res[0];
      } else {
        rsp.code = 200;
      }
      return {
        rsp
      };
    } catch (e) {
      return {
        rsp: {
          code: 500,
          msg: e.message
        }
      };
    }
  }
}
exports({ entryPoint: MyAPIHandler });