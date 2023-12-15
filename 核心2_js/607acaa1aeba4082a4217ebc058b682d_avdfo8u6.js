let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var id = request.id;
    //查询原订单详情
    var orderDefine = "select * from voucher.orderchange.OrderChangeDetail where originalOrderId=" + "'" + id + "'";
    var orderDefineRes = ObjectStore.queryByYonQL(orderDefine, "udinghuo");
    return { orderDefineRes };
  }
}
exports({ entryPoint: MyAPIHandler });