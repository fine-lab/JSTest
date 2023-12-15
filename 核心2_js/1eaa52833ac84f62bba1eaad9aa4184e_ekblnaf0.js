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
          let returndataMapTK = {};
          //查询退货单据列表  统计销售订单的退款金额
          var returnOrdersqlTK =
            "select  a.orderNo orderNo,  code  retcode from voucher.salereturn.SaleReturn " +
            "inner join voucher.salereturn.SaleReturnDetail a on  a.saleReturnId = id " +
            " where   returnStatus='ENDSALERETURN' and   saleReturnStatus='ENDSALERETURN' and  a.orderNo != null";
          if (orgid != "") {
            returnOrdersqlTK = returnOrdersqlTK + " and  salesOrgId ='" + orgid + "' ";
          }
          if (deptid != "") {
            returnOrdersqlTK = returnOrdersqlTK + " and  saleDepartmentId ='" + deptid + "' ";
          }
          returnOrdersqlTK = returnOrdersqlTK + "  group by a.orderNo,code ";
          var returnOrderslistTK = ObjectStore.queryByYonQL(returnOrdersqlTK, "udinghuo");
          for (var v = 0; v < returnOrderslistTK.length; v++) {
            var orderNo = returnOrderslistTK[v].orderNo;
            var code = returnOrderslistTK[v].retcode;
            returndataMapTK[code] = orderNo;
          }
          var sqlTuiKuan = "select orderno,oriSum   from arap.paybill.PayBill  where  billtype = 9   "; //PA00231005000009    CREFar230928000001
          var resTuiKuan = ObjectStore.queryByYonQL(sqlTuiKuan, "fiarap");
          let tuiKuandataMap = {};
          for (var o = 0; o < resTuiKuan.length; o++) {
            var orderNoTuiKuan = resTuiKuan[o].orderno;
            if (returndataMapTK[orderNoTuiKuan] != null && returndataMapTK[orderNoTuiKuan] != "") {
              var xiaoshoucode = returndataMapTK[orderNoTuiKuan];
              //退款金额
              var oriSumTuiKuan = resTuiKuan[o].oriSum;
              if (tuiKuandataMap[xiaoshoucode] != null && tuiKuandataMap[xiaoshoucode] != "") {
                var oldtuikuanjine = tuiKuandataMap[xiaoshoucode];
                tuiKuandataMap[xiaoshoucode] = oriSumTuiKuan + oldtuikuanjine;
              } else {
                tuiKuandataMap[xiaoshoucode] = oriSumTuiKuan;
              }
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
            resdata.data.recordList[x].returnAmount = 0;
            var extendamount = dataOrder[x].oriSum; //oriSum
            if (returnAmountMap[code] != null && returnAmountMap[code] != "") {
              var returnAmount = returnAmountMap[code];
              var lastAmount = payMoney - returnAmount; //退货调整优化  20230910
              resdata.data.recordList[x].payMoney = lastAmount; //退货调整优化  20230910
              resdata.data.recordList[x].returnAmount = returnAmount;
            }
            if (resdata.data.recordList[x].confirmPrice == null) {
              resdata.data.recordList[x].confirmPrice = 0;
            }
            if (zhekouMap[code] != null && zhekouMap[code] != "") {
              var youhuiAmount = zhekouMap[code];
              dataOrder[x].extend_DAmount2 = dataOrder[x].extend_DAmount2 + youhuiAmount;
              dataOrder[x].confirmPrice = dataOrder[x].confirmPrice - youhuiAmount;
              resdata.data.recordList[x].payMoney = resdata.data.recordList[x].payMoney - youhuiAmount;
              resdata.data.recordList[x].confirmPrice = resdata.data.recordList[x].confirmPrice - youhuiAmount;
            }
            if (zhekouMap2[code] != null && zhekouMap2[code] != "") {
              var youhuiAmount = zhekouMap2[code];
              dataOrder[x].extend_DAmount2 = dataOrder[x].extend_DAmount2 + youhuiAmount;
              resdata.data.recordList[x].payMoney = resdata.data.recordList[x].payMoney - youhuiAmount;
              resdata.data.recordList[x].confirmPrice = resdata.data.recordList[x].confirmPrice - youhuiAmount;
            }
            resdata.data.recordList[x].orderDetails_returnamount = 0;
            resdata.data.recordList[x].orderDetails_returnqty = 0;
            if (returndataMap[key] != null && returndataMap[key] != "") {
              var retrunData = returndataMap[key];
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
            if (tuiKuandataMap[code] != null && tuiKuandataMap[code] != "") {
              var tuikuanAmount = tuiKuandataMap[code];
              if (tuikuanAmount > 0) {
                resdata.data.recordList[x].confirmPrice = resdata.data.recordList[x].confirmPrice - tuikuanAmount;
              } else {
                resdata.data.recordList[x].confirmPrice = resdata.data.recordList[x].confirmPrice + tuikuanAmount;
              }
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