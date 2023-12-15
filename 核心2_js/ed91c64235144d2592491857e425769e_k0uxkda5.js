let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //查询安全库存
    let stockId = request.stockId;
    let orgId = request.orgId;
    let productID = request.productID;
    let sql = "select * from 	AT16560C6C08780007.AT16560C6C08780007.aqkcbd where cangku = '" + stockId + "' and wuliao = '" + productID + "' and org = '" + orgId + "'";
    let res = ObjectStore.queryByYonQL(sql, "developplatform");
    let safestock = {
      SX: 0,
      XX: 0
    };
    if (res.length > 0) {
      //下限库存
      safestock.XX = res[0].xiaxiananquankucun;
      //上限库存
      safestock.SX = res[0].shangxiananquankucun;
    }
    return { safestock };
  }
}
exports({ entryPoint: MyAPIHandler });