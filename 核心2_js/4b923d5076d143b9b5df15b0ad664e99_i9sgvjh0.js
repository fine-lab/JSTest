let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var ID = request.id;
    var sql = "select * from pc.product.Product where id = '" + ID + "'";
    var res = ObjectStore.queryByYonQL(sql, "productcenter");
    var kid = res[0].id;
    var purchase = "select * from pu.purchaseorder.PurchaseOrders where product = '" + kid + "' order by pubts desc";
    var purchaseList = ObjectStore.queryByYonQL(purchase, "upu");
    var aount = includes(JSON.stringify(purchaseList[0]), "oriUnitPrice");
    // 赋值
    var number = 0;
    // 判断返回的结果
    if (aount == true) {
      // 赋值
      number = purchaseList[0].oriUnitPrice;
    }
    return { number };
  }
}
exports({ entryPoint: MyAPIHandler });