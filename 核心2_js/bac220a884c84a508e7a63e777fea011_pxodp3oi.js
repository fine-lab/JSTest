let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var contextObj = JSON.parse(AppContext());
    var tid = contextObj.currentUser.tenantId;
    var staffId = contextObj.currentUser.staffId;
    let ReceiptPay = request.ReceiptPay;
    let PIs = request.PIs;
    let piArray = JSON.parse(PIs);
    if (ReceiptPay == "payment") {
      //付款单
      for (var j in piArray) {
        let piObj = piArray[j];
        let cwPI = piObj.cwPI;
        let supplier = piObj.supplier;
        let payAmount = 0;
        let sumAmount = 0;
        //查询已付金额--原采购订单金额--计算未付金额 --verifystate 2//settlestatus 2
        let paySql =
          "select sum(oriSum) as sumAmount from arap.paybill.PayBillb inner join arap.paybill.PayBill t on t.id=mainid where bodyItem.define1='" +
          cwPI +
          "' and supplier='" +
          supplier +
          "' and t.settlestatus=2";
        let payAmountRes = ObjectStore.queryByYonQL(paySql, "fiarap"); //已付金额
        if (payAmountRes.length == 0) {
        } else {
          payAmount = payAmountRes[0].sumAmount;
        }
        piObj.payAmount = payAmount;
        paySql =
          "select sum(oriSum) as sumAmount from pu.purchaseorder.PurchaseOrders inner join 	pu.purchaseorder.PurchaseOrder t on t.id=mainid where bodyItem.define1='" +
          cwPI +
          "' and t.vendor='" +
          supplier +
          "' and t.verifystate='2' and t.status !=2 ";
        let sumAmountRes = ObjectStore.queryByYonQL(paySql, "upu"); //采购订单金额
        if (sumAmountRes.length == 0) {
        } else {
          sumAmount = sumAmountRes[0].sumAmount;
        }
        piObj.sumAmount = sumAmount;
        piObj.noAmount = sumAmount - payAmount;
      }
      return { rst: true, msg: "success", ReceiptPay: ReceiptPay, PIs: PIs, piArray: piArray };
    } else {
      //收款单
      for (var j in piArray) {
        let piObj = piArray[j];
        let cwPI = piObj.cwPI;
        let supplier = piObj.supplier;
        let payAmount = 0;
        let sumAmount = 0;
        //查询已付金额--原采购订单金额--计算未付金额 --verifystate 2//settlestatus 2  //auditstatus
        let paySql =
          "select sum(oriSum) as sumAmount from arap.receivebill.ReceiveBill_b inner join arap.receivebill.ReceiveBill t on t.id=mainid where bodyItem.define1='" +
          cwPI +
          "' and customer='" +
          supplier +
          "' and t.verifystate='2'";
        let payAmountRes = ObjectStore.queryByYonQL(paySql, "fiarap"); //已收金额
        if (payAmountRes.length == 0) {
        } else {
          payAmount = payAmountRes[0].sumAmount;
        }
        piObj.payAmount = payAmount;
        paySql =
          "select sum(oriSum) as sumAmount from voucher.order.OrderDetail inner join voucher.order.Order t on t.id=orderId where bodyItem.define1='" +
          cwPI +
          "' and t.agentId='" +
          supplier +
          "' and t.verifystate='2'";
        let sumAmountRes = ObjectStore.queryByYonQL(paySql, "udinghuo"); //销售订单金额
        if (sumAmountRes.length == 0) {
        } else {
          sumAmount = sumAmountRes[0].sumAmount;
        }
        piObj.sumAmount = sumAmount;
        piObj.noAmount = sumAmount - payAmount;
      }
      return { rst: true, msg: "success", ReceiptPay: ReceiptPay, PIs: PIs, piArray: piArray };
    }
    return { rst: true, msg: "success", ReceiptPay: ReceiptPay, PIs: PIs, piArray: piArray };
  }
}
exports({ entryPoint: MyAPIHandler });