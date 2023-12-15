let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let id = request.id;
    let code = request.code;
    let type = request.type;
    let error_info = [];
    let errInfo = [];
    let bodysql =
      " select productCode, sendQuantity,qty, extendTotalCheckNum, extendTotalQualified, extendTotalUnqualified , totalOutStockQuantity " +
      " from voucher.delivery.DeliveryDetail  " +
      " where deliveryId =" +
      id;
    if (type == 1) {
      var deliveryList = ObjectStore.queryByYonQL(bodysql, "udinghuo");
      for (let i = 0; i < deliveryList.length; i++) {
        var qty = Number.parseFloat(GetBigDecimal(deliveryList[i].qty) == null ? 0 : GetBigDecimal(deliveryList[i].qty)); //主计量数量
        var extendTotalCheckNum = Number.parseFloat(GetBigDecimal(deliveryList[i].extendTotalCheckNum) == null ? 0 : GetBigDecimal(deliveryList[i].extendTotalCheckNum)); //累计复核数量
        var extendTotalQualified = Number.parseFloat(GetBigDecimal(deliveryList[i].extendTotalQualified) == null ? 0 : GetBigDecimal(deliveryList[i].extendTotalQualified)); //累计复核合格数量
        var extendTotalUnqualified = Number.parseFloat(GetBigDecimal(deliveryList[i].extendTotalUnqualified) == null ? 0 : GetBigDecimal(deliveryList[i].extendTotalUnqualified)); //累计复核不合格数量
        var totalOutStockQuantity = Number.parseFloat(GetBigDecimal(deliveryList[i].totalOutStockQuantity) == null ? 0 : GetBigDecimal(deliveryList[i].totalOutStockQuantity)); //累计出库数量
        if (qty == 0) {
          error_info.push("发货单:" + code + ", 商品：" + deliveryList[i].productCode + " 主计量数量(" + qty + ")不能为0!");
          break;
        }
        if (extendTotalCheckNum < totalOutStockQuantity) {
          error_info.push(
            "发货单:" + code + ", 商品：" + deliveryList[i].productCode + " 累计复核合格数量(" + extendTotalCheckNum + ")小于等于累计出库数量(" + totalOutStockQuantity + ") ,不允许出库!"
          );
          break;
        }
        if (qty != extendTotalCheckNum) {
          error_info.push("发货单:" + code + ", 商品：" + deliveryList[i].productCode + " 主计量数量(" + qty + ")不等于累计复核数量，不允许出库!");
          break;
        }
        if (extendTotalCheckNum != new Big(extendTotalQualified).plus(new Big(extendTotalUnqualified))) {
          error_info.push("发货单:" + code + ", 商品：" + deliveryList[i].productCode + " 累计复核数量不等于(累计复核合格数量+累计复核不合格数量), 不允许出库!");
          break;
        }
      }
    } else if (type == 2) {
      //下推销售出库复核校验
      var deliveryList = ObjectStore.queryByYonQL(bodysql, "udinghuo");
      for (let i = 0; i < deliveryList.length; i++) {
        var qty = Number.parseFloat(GetBigDecimal(deliveryList[i].qty) == null ? 0 : GetBigDecimal(deliveryList[i].qty)); //主计量数量
        var extendTotalCheckNum = Number.parseFloat(GetBigDecimal(deliveryList[i].extendTotalCheckNum) == null ? 0 : GetBigDecimal(deliveryList[i].extendTotalCheckNum)); //累计复核数量
        if (qty == 0) {
          error_info.push("发货单:" + code + ", 商品：" + deliveryList[i].productCode + " 主计量数量(" + qty + ")不能为0!");
          break;
        }
        if (qty < extendTotalCheckNum) {
          error_info.push("发货单:" + code + ", 商品：" + deliveryList[i].productCode + " 主计量数量(" + qty + ")小于累计复核数量(" + extendTotalCheckNum + ") ,不符合销售出库复核条件!");
          break;
        }
        if (qty == extendTotalCheckNum) {
          error_info.push("发货单:" + code + ", 商品：" + deliveryList[i].productCode + " 主计量数量(" + qty + ")等于累计复核数量(" + extendTotalCheckNum + ") , 已全部复核!");
          break;
        }
      }
    }
    for (var i = 0; i < error_info.length; i++) {
      errInfo += error_info[i] + " \n ";
    }
    return { errInfo };
  }
}
exports({ entryPoint: MyAPIHandler });