let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let id = request.id;
    if (!id) {
      return {};
    }
    // 获取id,查询对应采购订单
    let yonQl2 = " select * from pu.purchaseorder.PurchaseOrder where extend71 = '" + id + "'";
    var res1 = ObjectStore.queryByYonQL(yonQl2, "upu");
    // 获取采购id,查询对应到货单
    let dhid = res1[0].id;
    if (!dhid) {
      return {};
    }
    let Sql = "select * from	pu.arrivalorder.ArrivalOrders" + " where sourceid = '" + dhid + "'";
    var res2 = ObjectStore.queryByYonQL(Sql, "upu");
    let mainid = res2[0].mainid;
    if (!mainid) {
      return {};
    }
    let Sql3 = "select * from	pu.arrivalorder.ArrivalOrder" + " where id = '" + mainid + "'";
    var res3 = ObjectStore.queryByYonQL(Sql3, "upu");
    return { res3 };
  }
}
exports({ entryPoint: MyAPIHandler });