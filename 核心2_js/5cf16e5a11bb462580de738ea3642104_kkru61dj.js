let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    if (request.billNo == undefined) {
      return { info: [], error: "billNo不能为空" };
    }
    //不是数组也变成数组
    if (!Array.isArray(request.Ids)) {
      return { info: [], error: "Ids需要为数组" };
    }
    if (request.Ids.length == 0) {
      return { info: [], error: "Ids不能为空" };
    }
    if (request.billNo == "purchaseOrder") {
      let yonql = "select * from pu.purchaseorder.PurchaseOrder where id in (";
      for (let i = 0; i < request.Ids.length; i++) {
        yonql += "'" + request.Ids[i] + "',";
      }
      yonql = yonql.substring(0, yonql.length - 1) + ")";
      let res = ObjectStore.queryByYonQL(yonql, "upu");
      //查询子表
      for (let i = 0; i < res.length; i++) {
        let yonql1 = "select * from pu.purchaseorder.PurchaseOrders where mainid ='" + res[i].id + "'";
        res[i].entry = ObjectStore.queryByYonQL(yonql1, "upu");
      }
      return { info: res };
    }
    throw new Error("getBillInfo查询失败");
  }
}
exports({ entryPoint: MyAPIHandler });