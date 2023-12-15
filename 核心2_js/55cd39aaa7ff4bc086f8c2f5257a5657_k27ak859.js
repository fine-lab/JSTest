let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var code = "200"; //接口返回状态码
    var msg = ""; //接口返回状态信息
    var sql;
    var dt = {
      productDetails: [], //发货汇总商品详细
      customerDetails: [] //发货汇总单客户
    }; //sql查询返回的对象
    var Ids = []; //主表Ids
    var childIds = []; //子表Id
    try {
      Ids = request.Ids;
      childIds = request.childIds;
      if (Ids.length > 0 && childIds.length > 0) {
        sql = "SELECT b.id,b.code,b.enterpriseName from  voucher.delivery.DeliveryVoucher left join aa.merchant.Merchant b on agentId=b.id where id in (" + Ids + ")  GROUP BY(b.id) ORDER BY b.code";
        dt.customerDetails = ObjectStore.queryByYonQL(sql, "udinghuo");
        sql =
          "SELECT productName,orderDetailId,productCode,sum(sendQuantity) sendQuantity,productId,b.name from  voucher.delivery.DeliveryDetail left join pc.product.Product b on productId=b.id  where id in (" +
          childIds +
          ") GROUP BY(productId,productCode) ORDER BY productCode+'' ASC ";
        dt.productDetails = ObjectStore.queryByYonQL(sql, "udinghuo");
      }
    } catch (e) {
      code = "999";
      msg = e.toString();
    } finally {
      var res = {
        code: code,
        msg: msg,
        dt: dt
      };
      return {
        res
      };
    }
  }
}
exports({
  entryPoint: MyAPIHandler
});