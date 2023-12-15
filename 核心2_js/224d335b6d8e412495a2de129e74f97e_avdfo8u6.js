let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var id = request.id;
    //查询销售订单上的表体特征字段
    var querysql = "select * from voucher.order.OrderDetail where id='" + id + "'";
    var orderDefineFreeRes = ObjectStore.queryByYonQL(querysql, "udinghuo");
    return { orderDefineFreeRes };
  }
}
exports({ entryPoint: MyAPIHandler });