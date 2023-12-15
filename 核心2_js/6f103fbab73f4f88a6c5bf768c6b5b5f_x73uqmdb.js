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
    let totalGoodsQuantity = 0,
      totalGoodsAmount = 0,
      actuallyPaidAmount = 0;
    for (var j = 0; j < goodsOrderDetailList.length; j++) {
      let { quantity, amountActuallyPaid, unitPrice } = goodsOrderDetailList[j];
      totalGoodsQuantity += quantity;
      totalGoodsAmount += unitPrice * quantity;
      actuallyPaidAmount += amountActuallyPaid;
    }
    if (totalGoodsQuantity != goodsOrder.totalGoodsQuantity) {
      throw new Error("商品明细数量总和与合计商品数量不一致！");
    }
    if (totalGoodsAmount != goodsOrder.totalGoodsAmount) {
      throw new Error("商品明细金额总和与合计商品金额不一致！");
    }
    if (actuallyPaidAmount != goodsOrder.actuallyPaidAmount) {
      throw new Error("商品明细实付金额总和与合计商品实付金额不一致！");
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