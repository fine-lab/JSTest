let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //物料sku
    let productskun = request.productskun;
    //批次号
    let batchno = request.batchno;
    //物料
    let product = request.product;
    //计价数量
    let priceQty = request.priceQty;
    //含税金额
    let oriSum = request.oriSum;
    //无税金额
    let oriMoney = request.oriMoney;
    let sql1 = "select oriTaxUnitPrice,oriUnitPrice from st.purinrecord.PurInRecords where productskun = '" + productskun + "' and batchno = " + batchno + " and product = '" + product + "'";
    let res1 = ObjectStore.queryByYonQL(sql1, "ustock");
    let obj = {};
    if (res1.length > 0) {
      //含税成本
      let hscb = res1[0].oriUnitPrice * priceQty;
      //无税成本
      let wscb = res1[0].oriTaxUnitPrice * priceQty;
      //含税毛利
      let hsml = oriSum - hscb;
      //无税毛利
      let wsml = oriMoney - wscb;
      //含税毛利率
      let hsmll = MoneyFormatReturnBd(hsml / oriSum, 2);
      obj.hsmll = hsmll;
      //无税毛利率
      let wsmll = MoneyFormatReturnBd(wsml / oriMoney, 2);
      obj.wsmll = wsmll;
    }
    return { obj: obj };
  }
}
exports({ entryPoint: MyAPIHandler });