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
          for (var x = 0; x < dataOrder.length; x++) {
            var code = dataOrder[x].code;
            var payMoney = dataOrder[x].payMoney;
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
          }
        } else {
          let returnArr = [];
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
            "select  a.orderNo orderNo, a.orderDetailId orderDetailId , sum(a.priceQty) priceQty, sum(a.subQty) subQty,sum(a.qty)  qty, sum(a.oriSum) oriSum  " +
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
          //已经核销的金额
          var zhekouSql =
            "select  rebill.orderno orderno, sum(rebill.oriSum) oriSum  from  arap.receivebill.ReceiveBill  " +
            " inner join arap.receivebill.ReceiveBill_b rebill on rebill.mainid = id " +
            "where   auditstatus = 1  and  rebill.quickTypeCode = 4  and  writeoffstatus =1 ";
          zhekouSql = zhekouSql + " group by  rebill.orderno ";
          var zhekouRes = ObjectStore.queryByYonQL(zhekouSql, "fiarap");
          let zhekouMap = {};
          if (zhekouRes != null && zhekouRes.length > 0) {
            for (var q = 0; q < zhekouRes.length; q++) {
              var youhuiAmount = zhekouRes[q].oriSum;
              zhekouMap[zhekouRes[q].orderno] = youhuiAmount;
            }
          }
          //未核销  部分核销的金额
          zhekouSql =
            "select  rebill.orderno orderno, sum(rebill.oriSum) oriSum  from  arap.receivebill.ReceiveBill  " +
            " inner join arap.receivebill.ReceiveBill_b rebill on rebill.mainid = id " +
            "where   auditstatus = 1  and  rebill.quickTypeCode = 4  and  writeoffstatus !=1 ";
          zhekouSql = zhekouSql + " group by  rebill.orderno ";
          var zhekouRes2 = ObjectStore.queryByYonQL(zhekouSql, "fiarap");
          let zhekouMap2 = {};
          if (zhekouRes2 != null && zhekouRes2.length > 0) {
            for (var q = 0; q < zhekouRes2.length; q++) {
              var youhuiAmount = zhekouRes2[q].oriSum;
              zhekouMap2[zhekouRes2[q].orderno] = youhuiAmount;
            }
          }
          for (var x = 0; x < dataOrder.length; x++) {
            var code = dataOrder[x].code;
            var orderDetailId = dataOrder[x].orderDetailId;
            var key = code + "-" + orderDetailId;
            var payMoney = dataOrder[x].payMoney;
            if (dataOrder[x].extend_DAmount == null) {
              dataOrder[x].extend_DAmount2 = 0;
            } else {
              dataOrder[x].extend_DAmount2 = dataOrder[x].extend_DAmount;
            }
            if (zhekouMap[code] != null && zhekouMap[code] != "") {
              var youhuiAmount = zhekouMap[code];
              dataOrder[x].extend_DAmount2 = dataOrder[x].extend_DAmount2 + youhuiAmount;
              dataOrder[x].confirmPrice = dataOrder[x].confirmPrice - youhuiAmount;
            }
            if (zhekouMap2[code] != null && zhekouMap2[code] != "") {
              var youhuiAmount = zhekouMap2[code];
              dataOrder[x].extend_DAmount2 = dataOrder[x].extend_DAmount2 + youhuiAmount;
            }
            resdata.data.recordList[x].returnAmount = 0;
            var extendamount = dataOrder[x].oriSum; //oriSum
            if (returnAmountMap[code] != null && returnAmountMap[code] != "") {
              var returnAmount = returnAmountMap[code];
              resdata.data.recordList[x].returnAmount = returnAmount;
            }
            resdata.data.recordList[x].orderDetails_returnamount = 0;
            resdata.data.recordList[x].orderDetails_returnqty = 0;
            if (returndataMap[key] != null && returndataMap[key] != "") {
              var retrunData = returndataMap[key];
              var productId = dataOrder[x].productId;
              var batchNo = dataOrder[x].batchNo;
              var hexiaoSql =
                "select  topsrcbillno , oriSum ,customer,batchno,qty,material , bill.auditstatus auditstatus, bill.status status,bill.writeoffstatus writeoffstatus from  arap.oar.OarDetail " +
                " inner join arap.oar.OarMain bill  on  bill.id = mainid" +
                " where  topsrcbillno = '" +
                code +
                "' and  qty <0 and material='" +
                productId +
                "' and  batchno = '" +
                batchNo +
                "' ";
              var hexiaoRes = ObjectStore.queryByYonQL(hexiaoSql, "fiarap");
              if (hexiaoRes.length > 0) {
                var allreturnAmount = 0;
                for (var w = 0; w < hexiaoRes.length; w++) {
                  var hexiaoData = hexiaoRes[w];
                  if (hexiaoData.writeoffstatus == 1) {
                  } else if (hexiaoData.writeoffstatus == 2) {
                    allreturnAmount = allreturnAmount + hexiaoData.oriSum;
                  } else if (hexiaoData.writeoffstatus == 3) {
                    if (resdata.data.recordList[x].confirmPrice == null || dataOrder[x].confirmPrice == 0) {
                      allreturnAmount = allreturnAmount + oriSum;
                    } else if (resdata.data.recordList[x].confirmPrice < hexiaoData.oriSum) {
                      allreturnAmount = allreturnAmount + oriSum;
                    }
                  }
                }
                if (resdata.data.recordList[x].confirmPrice == null || dataOrder[x].confirmPrice == 0) {
                  resdata.data.recordList[x].confirmPrice = 0 - allreturnAmount;
                } else {
                  resdata.data.recordList[x].confirmPrice = resdata.data.recordList[x].confirmPrice - allreturnAmount;
                }
              }
              resdata.data.recordList[x].orderDetails_extendamount = extendamount;
              resdata.data.recordList[x].orderDetails_returnamount = returnAmount;
              resdata.data.recordList[x].orderDetails_returnqty = retrunData.qty;
              var subQty = retrunData.subQty;
              var priceQty = retrunData.priceQty;
              if (dataOrder[x].confirmPrice != null && dataOrder[x].confirmPrice != 0) {
                var confirmPrice = dataOrder[x].confirmPrice;
                if (lastAmount == confirmPrice) {
                  resdata.data.recordList[x].payStatusCode = "FINISHPAYMENT";
                }
              }
            } else {
              resdata.data.recordList[x].orderDetails_extendamount = dataOrder[x].oriSum;
            }
          }
        }
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