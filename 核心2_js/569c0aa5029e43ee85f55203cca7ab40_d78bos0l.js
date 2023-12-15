let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let productId = request.productId;
    //查询主表id
    let sql = "select mainid,id from pu.purchaseorder.PurchaseOrders where product=" + productId + " order by pubts desc";
    let resquest = ObjectStore.queryByYonQL(sql, "upu");
    if (resquest.length > 0) {
      for (var i = 0; i < resquest.length; i++) {
        let id = resquest[i].id;
        let mainid = resquest[i].mainid;
        // 查询表头自定义项
        let customSql = "select define3,id from pu.purchaseorder.PurchaseOrderFreeItem where id=" + mainid + "";
        var customRes = ObjectStore.queryByYonQL(customSql, "upu");
        let define1 = customRes[0].define3;
        if ("否" == define1) {
          let mid = customRes[0].id;
          // 查询采购价
          let sql1 = "select * from pu.purchaseorder.PurchaseOrders where mainid=" + mid + "";
          let resquest1 = ObjectStore.queryByYonQL(sql1, "upu");
          return { resquest1 };
        }
      }
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });