let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let sourceIds = [];
    //拉取红字采购订单
    if (request.type == "GSPRedPur") {
      let sql = "select distinct mainid,extend_review_qty from pu.purchaseorder.PurchaseOrders where mainid.status = 1 and mainid.extend_is_gsp in ('1','true') and qty < 0";
      let res = ObjectStore.queryByYonQL(sql, "upu");
      if (res.length > 0) {
        for (let i = 0; i < res.length; i++) {
          if (res[i].extend_review_qty == undefined || res[i].extend_review_qty == 0) sourceIds.push(res[i].mainid);
        }
      }
    }
    return {
      sourceIds
    };
  }
}
exports({
  entryPoint: MyAPIHandler
});