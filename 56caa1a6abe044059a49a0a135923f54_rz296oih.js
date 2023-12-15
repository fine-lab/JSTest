let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let id = request.srcBill;
    if (!id) {
      return {};
    }
    debugger;
    // 获取发货单主表id,查询发货单子表
    let yonQl1 = "select * from voucher.delivery.DeliveryDetail where deliveryId = '" + id + "'";
    var res1 = ObjectStore.queryByYonQL(yonQl1, "udinghuo");
    // 获取发货单子表下所有SN
    let deliveryDetailsid = [];
    if (res1) {
      for (let i = 0; i < res1.length; i++) {
        deliveryDetailsid.push(res1[i].id);
      }
    }
    if (!deliveryDetailsid.length > 0) {
      return {};
    }
    let yonQl2 = "select * from	voucher.delivery.snSalesMessage" + " where DeliveryDetail_id in ( " + deliveryDetailsid.join(",") + ")";
    var res2 = ObjectStore.queryByYonQL(yonQl2, "udinghuo");
    return { res: res2 };
  }
}
exports({ entryPoint: MyAPIHandler });