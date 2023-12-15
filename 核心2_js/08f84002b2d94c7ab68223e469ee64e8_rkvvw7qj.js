let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //原销售订单成交价格
    let sqlx = "select * from voucher.order.OrderDetail where code=" + "000495";
    var res1 = ObjectStore.queryByYonQL(sqlx, "udinghuo");
    var x = [];
    return {};
  }
}
exports({ entryPoint: MyTrigger });