let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var salesOrderId = request.id;
    let salesOrderInfo = openLinker("GET", "https://www.example.com/" + salesOrderId, "AT1687962816100005", null);
    let salesOrderlist = JSON.parse(salesOrderInfo);
    let paymentStatus; //付款状态 NOTPAYMENT为未付款
    let projectCode = "null"; //项目编码
    let invoicedAmount = "0"; //开票金额
    let cumulativeIssueQuantity = "0"; //累计出库数量
    //获取付款状态、项目编码、开票金额、累计出库数量
    if (salesOrderlist.code == "200") {
      //获取付款状态
      if (salesOrderlist.data.payStatusCode) {
        paymentStatus = salesOrderlist.data.payStatusCode;
      }
      //获取项目编码
      if (salesOrderlist.data.orderDetails.projectId_code >= 0) {
        projectCode = salesOrderlist.data.orderDetails.projectId_code;
      }
      //获得开票金额
      if (salesOrderlist.data.orderPrices.invoiceOriSum >= 0) {
        invoicedAmount = salesOrderlist.data.orderPrices.invoiceOriSum;
      }
      //获取累计出库数量
      var QuantityDelivered = new Array();
      for (let i = 0; i < salesOrderlist.data.orderDetails.length; i++) {
        var item = {
          "cumulativeIssueQuantity ": salesOrderlist.data.orderDetails[i].totalOutStockQuantity
        };
      }
    }
    if (paymentStatus != "NOTPAYMENT") {
      paymentStatus = "1"; //其他支付状态
    } else {
      paymentStatus = "0";
    }
    if (projectCode > 0) {
      projectCode = "1"; //存在项目编码
    }
    if (invoicedAmount > 0) {
      invoicedAmount = 1; //存在开票金额
    }
    if (cumulativeIssueQuantity > 0) {
      cumulativeIssueQuantity = 1; //存在出库数量
    }
    if (paymentStatus > 0 || (projectCode > 0 && projectCode != undefined && projectCode != null) || invoicedAmount > 0 || cumulativeIssueQuantity > 0) {
      //当前订单有上下游单据，返回错误信息
      return { message: "已有上下游单据,不可弃审" };
    } else {
      var OrderAbandonment = openLinker("POST", "https://www.example.com/" + salesOrderId, "AT1687962816100005", null);
      var Abandonment = JSON.parse(OrderAbandonment);
      [光标位置]
    }
  }
}
exports({ entryPoint: MyAPIHandler });