let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var ID = request.id;
    // 赋值
    var number = 0;
    let productSunSql = "select planDefaultAttribute from pc.product.ProductDetail where productId = '" + ID + "'";
    let productRes = ObjectStore.queryByYonQL(productSunSql, "productcenter");
    if (productRes.length > 0) {
      var planDefaultAttribute = productRes[0].planDefaultAttribute; // 默认计划属性
      if (planDefaultAttribute == "1") {
        var purchase = "select * from	pu.purchaseorder.PurchaseOrders where product = '" + ID + "' order by pubts desc";
        var purchaseList = ObjectStore.queryByYonQL(purchase, "upu");
        var aount = includes(JSON.stringify(purchaseList[0].oriUnitPrice), "oriUnitPrice");
        // 判断返回的结果
        if (aount == false) {
          // 赋值
          var price = purchaseList[0].oriUnitPrice;
          number = Math.round(price * 100) / 100;
        }
      }
      if (planDefaultAttribute == "5") {
        let SubcontractProductSql = "select productId,id from po.order.OrderProduct group by productId";
        let SubcontractProductRes = ObjectStore.queryByYonQL(SubcontractProductSql, "productionorder");
        for (let k = 0; k < SubcontractProductRes.length; k++) {
          let SubcontractID = SubcontractProductRes[k].id;
          let SubcontractProductID = SubcontractProductRes[k].productId;
          if (SubcontractProductID == ID) {
            let SubcontractSunProductSql = "select natTaxUnitPrice from po.order.SubcontractProduct where id = '" + SubcontractID + "'";
            let SubcontractSunProductRes = ObjectStore.queryByYonQL(SubcontractSunProductSql, "productionorder");
            if (SubcontractSunProductRes.length > 0) {
              let natTaxUnitPrice = SubcontractSunProductRes[0].natTaxUnitPrice;
              // 判断金额字段是否存在
              var aoumant = includes(JSON.stringify(natTaxUnitPrice), "natTaxUnitPrice");
              // 判断返回的结果
              if (aoumant == false) {
                // 赋值
                var PIC = natTaxUnitPrice;
                number = Math.round(PIC * 100) / 100;
              }
            }
          }
        }
      }
    }
    return { number };
  }
}
exports({ entryPoint: MyAPIHandler });