let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let pss = request.pss;
    let productId = request.productId;
    let dw = null;
    let xsjj = null;
    let kdj = null;
    //获取销售净价
    let sql2 = "select priceRecordId from 	marketing.price.PriceRecordDimension where agentId = '" + pss + "' and productId = '" + productId + "'";
    var res2 = ObjectStore.queryByYonQL(sql2, "marketingbill");
    if (res2.length > 0) {
      let priceRecordId = res2[0].priceRecordId;
      let sql21 = "select price from marketing.price.PriceRecord where id = '" + priceRecordId + "'";
      var res21 = ObjectStore.queryByYonQL(sql21, "marketingbill");
      if (res21.length > 0) {
        xsjj = res21[0].price;
      } else {
        xsjj = 0;
      }
    } else {
      xsjj = 0;
    }
    //获取开单价
    let sql3 = "select id from voucher.order.Order where agentId = '" + pss + "' order by vouchdate DESC limit 1";
    var res3 = ObjectStore.queryByYonQL(sql3, "udinghuo");
    if (res3.length > 0) {
      let sql31 = "select oriTaxUnitPrice from voucher.order.OrderDetail where orderId = '" + res3[0].id + "' and productId = '" + productId + "'";
      var res31 = ObjectStore.queryByYonQL(sql31, "udinghuo");
      if (res31.length > 0) {
        kdj = res31[0].oriTaxUnitPrice;
      } else {
        kdj = 0;
      }
    } else {
      kdj = 0;
    }
    //获取单位
    let sql4 = "select unit from pc.product.Product where id = '" + productId + "'";
    var res4 = ObjectStore.queryByYonQL(sql4, "productcenter");
    if (res4.length > 0) {
      let sql41 = "select name from aa.product.ProductUnit where id = '" + res4[0].unit + "'";
      var res41 = ObjectStore.queryByYonQL(sql41, "productcenter");
      if (res41.length > 0) {
        dw = res41[0].name;
      }
    }
    debugger;
    return { xsjj: xsjj, kdj: kdj, dw: dw };
  }
}
exports({ entryPoint: MyAPIHandler });