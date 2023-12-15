let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取工程单编号
    let orderNo = request.data;
    var sql =
      "select order_id.distributor supplierCode,product.name product_name,product.code product_code,number " +
      "from AT187C938409200001.AT187C938409200001.orderDetail t " +
      "left join order_id t1 on order_id=t.id  where order_id.btn = '" +
      orderNo +
      "' ";
    var res = ObjectStore.queryByYonQL(sql);
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });