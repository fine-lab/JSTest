let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var id = request.id;
    let url = "https://www.example.com/" + id;
    let apiResponse = openLinker("GET", url, "SCMSA", JSON.stringify(request));
    let resdata = JSON.parse(apiResponse);
    var data = {};
    if (resdata != null && resdata.code != null && resdata.code == "200") {
      let data1 = resdata.data;
      var code = data1.code;
      //查询单据详情
      var returnOrdersql =
        "select  a.orderNo orderNo, a.orderDetailId orderDetailId , sum(a.priceQty) priceQty, sum(a.subQty) subQty,sum(a.oriSum) oriSum from voucher.salereturn.SaleReturn " +
        "inner join voucher.salereturn.SaleReturnDetail a on  a.saleReturnId = id " +
        " where   returnStatus='ENDSALERETURN' and   saleReturnStatus='ENDSALERETURN' and  a.orderNo ='" +
        code +
        "' ";
      returnOrdersql = returnOrdersql + "  group by a.orderNo, a.orderDetailId ";
      var returnOrderslist = ObjectStore.queryByYonQL(returnOrdersql, "udinghuo");
      let returndataMap = {};
      if (returnOrderslist != null && returnOrderslist.length > 0) {
        for (var w = 0; w < returnOrderslist.length; w++) {
          var orderNo = returnOrderslist[w].orderNo;
          var oriSum = returnOrderslist[w].oriSum;
          var orderDetailId = returnOrderslist[w].orderDetailId;
          returndataMap[orderDetailId] = returnOrderslist[w];
        }
      }
      var zhekouSql =
        "select   sum(rebill.oriSum) oriSum  from  arap.receivebill.ReceiveBill  " +
        " inner join arap.receivebill.ReceiveBill_b rebill on rebill.mainid = id " +
        "where   auditstatus = 1  and  rebill.quickTypeCode = 4 and   rebill.orderno = '" +
        code +
        "' ";
      var zhekouRes = ObjectStore.queryByYonQL(zhekouSql, "fiarap");
      var youhuiAmount = 0;
      if (zhekouRes != null && zhekouRes.length > 0) {
        for (var q = 0; q < zhekouRes.length; q++) {
          var youhuiAmount = zhekouRes[q].oriSum;
        }
      }
      if (data1.extend_DAmount == null) {
        data1.extend_DAmount = youhuiAmount;
      } else {
        data1.extend_DAmount = data1.extend_DAmount + youhuiAmount;
      }
      for (var x = 0; x < data1.orderDetails.length; x++) {
        var id = data1.orderDetails[x].id;
        var extendamount = data1.orderDetails[x].oriSum;
        if (returndataMap[id] != null && returndataMap[id] != "") {
          var dataReturn = returndataMap[id];
          var returnAmount = dataReturn.oriSum;
          var lastAmount = extendamount - returnAmount;
          data1.orderDetails[x].extendamount = lastAmount;
          var subQtyReturn = dataReturn.subQty;
          var priceQtyReturn = dataReturn.priceQty;
          var subQty = data1.orderDetails[x].subQty;
          var priceQty = data1.orderDetails[x].priceQty;
          data1.orderDetails[x].qty = subQty - subQtyReturn;
          data1.orderDetails[x].subQty = subQty - subQtyReturn;
          data1.orderDetails[x].priceQty = priceQty - priceQtyReturn;
          if (lastAmount <= 0) {
            data1.orderDetails = data1.orderDetails.filter((item) => item.id != id);
          }
        } else {
          data1.orderDetails[x].extendamount = extendamount;
        }
      }
      data = data1;
    }
    return { data };
  }
}
exports({ entryPoint: MyAPIHandler });