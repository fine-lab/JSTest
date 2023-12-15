let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var simpleVOsArr = request.simpleVOs;
    var orgid = "";
    var deptid = "";
    var isSum = true;
    if (request.isSum != null) {
      isSum = request.isSum;
    }
    for (var i = 0; i < simpleVOsArr.length; i++) {
      var da = simpleVOsArr[i];
      if (da.field == "salesOrgId" && da.field == "eq") {
        orgid = da.value1;
      } else if (da.field == "saleDepartmentId" && da.field == "eq") {
        deptid = da.value1;
      }
    }
    let url = "https://www.example.com/";
    let apiResponse = openLinker("POST", url, "SCMSA", JSON.stringify(request));
    let resdata = JSON.parse(apiResponse);
    //查询单据详情
    var sumAmount = 0;
    var sumShouldPay = 0;
    var data = {};
    if (resdata != null && resdata.code != null && resdata.code == "200") {
      let data1 = resdata.data;
      if (data1 != null && data1.recordList != null) {
        var dataOrder = data1.recordList;
        if (isSum) {
          //查询单据列表
          var returnOrdersql =
            "select  a.orderNo orderNo,  sum(a.qty) qty,sum(a.oriSum) oriSum from voucher.salereturn.SaleReturn " +
            "inner join voucher.salereturn.SaleReturnDetail a on  a.saleReturnId = id " +
            " where   returnStatus='ENDSALERETURN' and   saleReturnStatus='ENDSALERETURN' and  a.orderNo != null";
          if (orgid != "") {
            returnOrdersql = returnOrdersql + " and  salesOrgId ='" + orgid + "' ";
          }
          if (deptid != "") {
            returnOrdersql = returnOrdersql + " and  saleDepartmentId ='" + deptid + "' ";
          }
          returnOrdersql = returnOrdersql + "  group by a.orderNo ";
          let returndataMap = {};
          var returnOrderslist = ObjectStore.queryByYonQL(returnOrdersql, "udinghuo");
          for (var w = 0; w < returnOrderslist.length; w++) {
            var orderNo = returnOrderslist[w].orderNo;
            var oriSum = returnOrderslist[w].oriSum;
            returndataMap[orderNo] = oriSum;
          }
          var zhekouSql =
            "select  rebill.orderno orderno, sum(rebill.oriSum) oriSum  from  arap.receivebill.ReceiveBill  " +
            " inner join arap.receivebill.ReceiveBill_b rebill on rebill.mainid = id " +
            "where   auditstatus = 1  and  rebill.quickTypeCode = 4   ";
          zhekouSql = zhekouSql + " group by  rebill.orderno ";
          var zhekouRes = ObjectStore.queryByYonQL(zhekouSql, "fiarap");
          let zhekouMap = {};
          if (zhekouRes != null && zhekouRes.length > 0) {
            for (var q = 0; q < zhekouRes.length; q++) {
              var youhuiAmount = zhekouRes[q].oriSum;
              zhekouMap[zhekouRes[q].orderno] = youhuiAmount;
            }
          }
          if (data1.extend_DAmount == null) {
            data1.extend_DAmount = youhuiAmount;
          } else {
            data1.extend_DAmount = data1.extend_DAmount + youhuiAmount;
          }
          for (var x = 0; x < dataOrder.length; x++) {
            var code = dataOrder[x].code;
            var payMoney = dataOrder[x].payMoney;
            if (zhekouMap[code] != null && zhekouMap[code] != "") {
              var youhuiAmount = zhekouMap[code];
              var lastAmount = payMoney - youhuiAmount;
              resdata.data.recordList[x].payMoney = lastAmount;
              if (dataOrder[x].confirmPrice != null && dataOrder[x].confirmPrice != 0) {
                var confirmPrice = dataOrder[x].confirmPrice;
                if (lastAmount == confirmPrice) {
                  resdata.data.recordList[x].payStatusCode = "FINISHPAYMENT";
                }
              }
            }
            if (returndataMap[code] != null && returndataMap[code] != "") {
              var returnAmount = returndataMap[code];
              var lastAmount = payMoney - returnAmount;
              resdata.data.recordList[x].payMoney = lastAmount;
              if (dataOrder[x].confirmPrice != null && dataOrder[x].confirmPrice != 0) {
                var confirmPrice = dataOrder[x].confirmPrice;
                if (lastAmount == confirmPrice) {
                  resdata.data.recordList[x].payStatusCode = "FINISHPAYMENT";
                }
              }
            }
            sumAmount = sumAmount + resdata.data.recordList[x].payMoney;
            sumShouldPay = sumShouldPay + resdata.data.recordList[x].confirmPrice;
          }
        } else {
          let returnAmountMap = {};
          //查询单据列表
          var returnOrdersql =
            "select  a.orderNo orderNo, sum(a.oriSum) oriSum from voucher.salereturn.SaleReturn " +
            "inner join voucher.salereturn.SaleReturnDetail a on  a.saleReturnId = id " +
            " where   returnStatus='ENDSALERETURN' and   saleReturnStatus='ENDSALERETURN' and  a.orderNo != null";
          if (orgid != "") {
            returnOrdersql = returnOrdersql + " and  salesOrgId ='" + orgid + "' ";
          }
          if (deptid != "") {
            returnOrdersql = returnOrdersql + " and  saleDepartmentId ='" + deptid + "' ";
          }
          returnOrdersql = returnOrdersql + "  group by a.orderNo ";
          var returnOrderslist = ObjectStore.queryByYonQL(returnOrdersql, "udinghuo");
          for (var w = 0; w < returnOrderslist.length; w++) {
            var orderNo = returnOrderslist[w].orderNo;
            var oriSum = returnOrderslist[w].oriSum;
            returnAmountMap[orderNo] = oriSum;
          }
          //查询单据列表
          var returnOrdersql =
            "select  a.orderNo orderNo, a.orderDetailId orderDetailId , sum(a.priceQty) priceQty, sum(a.subQty) subQty,sum(a.oriSum) oriSum  " +
            "from voucher.salereturn.SaleReturn " +
            "inner join voucher.salereturn.SaleReturnDetail a on  a.saleReturnId = id " +
            " where   returnStatus='ENDSALERETURN' and   saleReturnStatus='ENDSALERETURN' and  a.orderNo != null";
          if (orgid != "") {
            returnOrdersql = returnOrdersql + " and  salesOrgId ='" + orgid + "' ";
          }
          if (deptid != "") {
            returnOrdersql = returnOrdersql + " and  saleDepartmentId ='" + deptid + "' ";
          }
          returnOrdersql = returnOrdersql + "  group by a.orderNo, a.orderDetailId ";
          let returndataMap = {};
          var returnOrderslist = ObjectStore.queryByYonQL(returnOrdersql, "udinghuo");
          for (var w = 0; w < returnOrderslist.length; w++) {
            var orderNo = returnOrderslist[w].orderNo;
            var orderDetailId = returnOrderslist[w].orderDetailId;
            var key = orderNo + "-" + orderDetailId;
            returndataMap[key] = returnOrderslist[w];
          }
          for (var x = 0; x < dataOrder.length; x++) {
            var code = dataOrder[x].code;
            var orderDetailId = dataOrder[x].orderDetailId;
            var key = code + "-" + orderDetailId;
            var payMoney = 0;
            if (dataOrder[x].orderDetails_extendamount == null) {
              payMoney = dataOrder[x].oriSum;
            } else {
              payMoney = dataOrder[x].orderDetails_extendamount;
            }
            var extendamount = payMoney;
            if (returnAmountMap[code] != null && returnAmountMap[code] != "") {
              var returnAmount = returnAmountMap[code];
              var lastAmount = payMoney - returnAmount;
              resdata.data.recordList[x].payMoney = lastAmount;
            } else {
              resdata.data.recordList[x].payMoney = payMoney;
            }
            sumAmount = sumAmount + resdata.data.recordList[x].payMoney;
            sumShouldPay = sumShouldPay + resdata.data.recordList[x].confirmPrice;
            if (returndataMap[key] != null && returndataMap[key] != "") {
              var retrunData = returndataMap[key];
              resdata.data.recordList[x].orderDetails_extendamount = extendamount - returnAmount;
              var subQty = retrunData.subQty;
              var priceQty = retrunData.priceQty;
              resdata.data.recordList[x].subQty = resdata.data.recordList[x].subQty - subQty;
              resdata.data.recordList[x].priceQty = resdata.data.recordList[x].priceQty - priceQty;
              if (dataOrder[x].confirmPrice != null && dataOrder[x].confirmPrice != 0) {
                var confirmPrice = dataOrder[x].confirmPrice;
                if (lastAmount == confirmPrice) {
                  resdata.data.recordList[x].payStatusCode = "FINISHPAYMENT";
                }
              }
            }
          }
        }
        data1.sumRecordList[0].realMoney = sumAmount;
        data1.sumRecordList[0].orderPayMoney = sumShouldPay;
        var aaa = data1.sumRecordList;
        data.pageIndex = data1.pageIndex;
        data.pageSize = data1.pageSize;
        data.recordCount = data1.recordCount;
        data.recordList = dataOrder;
        data.sumRecordList = data1.sumRecordList;
        data.pageCount = data1.pageCount;
        data.beginPageIndex = data1.beginPageIndex;
        data.endPageIndex = data1.endPageIndex;
      }
    }
    return { data };
  }
}
exports({ entryPoint: MyAPIHandler });