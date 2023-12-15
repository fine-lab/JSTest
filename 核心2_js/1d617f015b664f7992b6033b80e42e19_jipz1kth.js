let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var data = param.data[0];
    var createSource = data.createSource;
    //订单来源于U订货门户
    if (createSource == "2") {
      var orderDetails = data.orderDetails;
      orderDetails.forEach((line) => {
        let stockId = line.stockId;
        if (!stockId || stockId.length === 0) {
          let stockOrgId = line.stockOrgId;
          let productId = line.productId;
          let sql =
            "select deliveryWarehouse " + "from pc.product.ProductApplyRangeDetail a " + "left join id on a.id=id.id where id.orgId='" + stockOrgId + "' " + "and id.productId='" + productId + "'";
          let productExtendInfo = ObjectStore.queryByYonQL(sql, "productcenter");
          if (productExtendInfo && productExtendInfo.length > 0) {
            let deliveryWarehouse = productExtendInfo[0].deliveryWarehouse + "";
            if (deliveryWarehouse && deliveryWarehouse.length > 0) {
              line.set("stockId", deliveryWarehouse + "");
            }
          }
        }
      });
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });