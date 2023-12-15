let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let sourceid = request.id;
    if (!sourceid) {
      return {};
    }
    //查询内容
    //实体查询
    let orderSql = "select *,(select * from purchaseOrders ) purchaseOrders ";
    orderSql += " from pu.purchaseorder.PurchaseOrder where id  = '" + sourceid + "'";
    let orderRes = ObjectStore.queryByYonQL(orderSql, "upu");
    let shipScheduId = orderRes[0].extend71;
    if (!shipScheduId) {
      return {};
    }
    let querySql = " select *,(select * from shippingschedulebList) shippingschedulebList from GT37595AT2.GT37595AT2.shippingschedule where id = '" + shipScheduId + "'";
    let shipResult = ObjectStore.queryByYonQL(querySql, "developplatform");
    return {
      orderRes,
      shipResult
    };
  }
}
exports({ entryPoint: MyAPIHandler });