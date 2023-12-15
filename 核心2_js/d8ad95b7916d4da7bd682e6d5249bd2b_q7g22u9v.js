let AbstractTrigger = require("AbstractTrigger");
let queryUtils = extrequire("GT52668AT9.CommonUtils.QueryUtils");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let bill = param.data[0];
    let orderDetails = bill.orderDetails;
    let salesOrgId = bill.salesOrgId;
    let agentId = bill.agentId;
    let currencyId = bill.orderPrices.currency;
    let vouchdate = bill.vouchdate;
    vouchdate = queryUtils.getDateString(vouchdate);
    for (let irow = 0; irow < orderDetails.length; irow++) {
      let orderDetail = orderDetails[irow];
      let productId = orderDetail.productId;
      let skuId = orderDetail.skuId;
      let sql =
        "select skuId,price " +
        "from goods.price.ProductPrice " +
        "where saleOrgId='" +
        salesOrgId +
        "' " + //"and bizId='" + agentId + "' " +
        "and currencyId='" +
        currencyId +
        "' " +
        "and productId='" +
        productId +
        "' " +
        "and (skuId='" +
        skuId +
        "' or ifnull(skuId,'')='') " +
        "and startDate<='" +
        vouchdate +
        "' " +
        "order by startDate desc ,skuId desc ";
      let priceInfos = ObjectStore.queryByYonQL(sql, "marketingbill");
      if (null === priceInfos || priceInfos.length === 0) {
        continue;
      }
      if (!orderDetail.bodyItem) {
        orderDetail.set("bodyItem", {});
        orderDetail.bodyItem.set("_entityName", "voucher.order.OrderDetailDefine");
        orderDetail.bodyItem.set("_keyName", "orderDetailId");
        orderDetail.bodyItem.set("_realtype", true);
        orderDetail.bodyItem.set("_status", "Insert");
        orderDetail.bodyItem.set("id", orderDetail.id + "");
      }
      let priceInfo = priceInfos[0];
      let salePrice = priceInfo.price;
      let priceQty = orderDetail.priceQty;
      let saleCost = MoneyFormatReturnBd(salePrice * priceQty, 2);
      orderDetail.bodyItem.set("define8", salePrice + "");
      orderDetail.bodyItem.set("define9", saleCost + "");
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });