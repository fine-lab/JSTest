let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let id = request.srcBill;
    if (!id) {
      return {};
    }
    // 获取到货单主表id,查询到货单子表
    let yonQl1 = " select * from pu.arrivalorder.ArrivalOrders where mainid = '" + id + "'";
    var res1 = ObjectStore.queryByYonQL(yonQl1, "upu");
    // 获取到货单子表下所有SN
    let arrivalOrdersid = [];
    if (res1) {
      for (let i = 0; i < res1.length; i++) {
        arrivalOrdersid.push(res1[i].id);
      }
    }
    if (!arrivalOrdersid) {
      return {};
    }
    let yonQl2 = "select * from	pu.arrivalorder.snMessage" + " where ArrivalOrders_id in ( " + arrivalOrdersid.join(",") + ")";
    var res2 = ObjectStore.queryByYonQL(yonQl2, "upu");
    return { res: res2 };
  }
}
exports({ entryPoint: MyAPIHandler });