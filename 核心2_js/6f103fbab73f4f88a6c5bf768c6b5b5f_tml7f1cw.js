let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 获取请求参数
    var goodsOrder = request.goodsOrder;
    // 校验参数
    checkParams(goodsOrder);
    var res = ObjectStore.insertBatch("AT16879EEA1CB0000A.AT16879EEA1CB0000A.goodsOrder", goodsOrder, "ybde540054");
    return { res };
  }
}
function checkParams(params) {
  let smallBillNumberStr = "";
  for (var i = 0; i < params.length; i++) {
    let goodsOrder = params[i];
    smallBillNumberStr += "'" + goodsOrder.smallBillNumber + "',";
    let goodsOrderDetailList = goodsOrder.goodsOrdeDetailList;
    let totalGoodsQuantity = 0.0,
      totalGoodsAmount = 0.0,
      actuallyPaidAmount = 0.0;
    for (var j = 0; j < goodsOrderDetailList.length; j++) {
      let { quantity, amountActuallyPaid, unitPrice, hd_deduction, discount_amount } = goodsOrderDetailList[j];
      let BigunitPrice = new Big(unitPrice); // 单价
      let Bigquantity = new Big(quantity); // 数量
      let Bighd_deduction = new Big(hd_deduction); // 惠豆抵扣金额
      let Bigdiscount_amount = new Big(discount_amount); // 优惠金额
      let goodsAmount = new Big(0);
      totalGoodsQuantity = Bigquantity.plus(totalGoodsQuantity);
      goodsAmount = BigunitPrice.times(Bigquantity).minus(Bighd_deduction).minus(Bigdiscount_amount);
      totalGoodsAmount = goodsAmount.plus(totalGoodsAmount);
      //商品实付金额
      let goodsActualAmount = new Big(amountActuallyPaid);
      actuallyPaidAmount = goodsActualAmount.plus(actuallyPaidAmount);
    }
    //商品明细金额总和保留小数点2位，四舍五入
    var val = totalGoodsAmount;
    var totalGoodsAmountS = MoneyFormatReturnBd("" + val, 4);
    //商品明细数量总和保留小数点3位，四舍五入
    var val1 = totalGoodsQuantity;
    var totalGoodsQuantityS = MoneyFormatReturnBd("" + val1, 3);
    if (totalGoodsQuantityS != goodsOrder.totalGoodsQuantity) {
      throw new Error("商品明细数量总和与合计商品数量不一致！商品明细数量总和:" + totalGoodsQuantityS + ";合计商品数量:" + goodsOrder.totalGoodsQuantity);
    }
    if (actuallyPaidAmount != goodsOrder.actuallyPaidAmount) {
      throw new Error("商品明细实付金额总和与合计商品实付金额不一致！商品明细实付金额总和:" + actuallyPaidAmount + ";合计商品实付金额:" + goodsOrder.actuallyPaidAmount);
    }
  }
  smallBillNumberStr += "'0'";
  //小票号是否重复
  let sql = "select count(id) id from AT16879EEA1CB0000A.AT16879EEA1CB0000A.goodsOrder where smallBillNumber in (" + smallBillNumberStr + ")";
  let res = ObjectStore.queryByYonQL(sql);
  if (res[0].id > 0) {
    throw new Error("小票号已存在！");
  }
}
exports({ entryPoint: MyAPIHandler });