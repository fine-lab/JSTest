let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //代办
    let sql = "select costSetPrice from AT168A396609980009.AT168A396609980009.single_finished_product_price where productCode =" + request.productCode;
    var res = ObjectStore.queryByYonQL(sql);
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });