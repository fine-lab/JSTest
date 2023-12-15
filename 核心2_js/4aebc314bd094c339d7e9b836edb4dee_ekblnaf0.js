let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var pageIndex = request.pageIndex;
    var pageSize = request.pageSize;
    var open_vouchdate_begin = request.openvouchdatebegin;
    var open_vouchdate_end = request.openvouchdateend;
    var orgid = request.orgid;
    var agentId = request.agentId;
    var deptid = request.deptid;
    var value1 = request.value1;
    var value2 = request.value2;
    if (request.orgid != null && request.orgid != "") {
      orgid = request.orgid;
    }
    if (request.deptid != null && request.deptid != "") {
      deptid = request.deptid;
    }
    //查询优惠金额
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
    var sql =
      "select  distinct   id , ifnull(a.expiringDateTime,auditDate) expiringDateTime ,ifnull(a.accountDay,0) accountDay  " +
      " from voucher.order.Order  left join voucher.order.PaymentExeDetail   a on  a.mainid = id " +
      " where  nextStatus <> 'CONFIRMORDER'    and payStatusCode <> 'CONFIRMPAYMENT_ALL' " + // and  payStatusCode <> 'FINISHPAYMENT'
      "   and  agentId = '" +
      agentId +
      "'   and  (a.vouchtype='voucher_order'  or a.vouchtype= null) and  extendisxcx ='是' ";
    if (orgid != null && orgid != "") {
      sql = sql + " and salesOrgId = '" + orgid + "' ";
    }
    if (deptid != null && deptid != "") {
      sql = sql + "  and  saleDepartmentId  = '" + deptid + "'  ";
    }
    if (value2 == "1") {
      sql = sql + " and  ifnull(a.expiringDateTime,auditDate)  = '" + value1 + "'  ";
    } else if (value2 == "2") {
      sql = sql + " and  ifnull(a.expiringDateTime,auditDate)  < '" + value1 + "'  ";
    } else if (value2 == "3") {
      sql = sql + " and  ifnull(a.expiringDateTime,auditDate)   > '" + value1 + "'  ";
    }
    if (open_vouchdate_begin != null && open_vouchdate_begin != "") {
      sql = sql + " and vouchdate >=  '" + open_vouchdate_begin + "' ";
    }
    if (open_vouchdate_end != null && open_vouchdate_end != "") {
      sql = sql + " and vouchdate <=  '" + open_vouchdate_end + "' ";
    }
    var sqlCount = sql;
    var resCount = ObjectStore.queryByYonQL(sqlCount, "udinghuo");
    if (pageIndex != null && pageSize != null) {
      sql = sql + "  order by vouchdate desc,code limit " + pageIndex + "," + pageSize + " ";
    } else {
      sql = sql + "  order by vouchdate desc,code limit 1,30 ";
    }
    var res = ObjectStore.queryByYonQL(sql, "udinghuo");
    let restMap = {};
    for (var z = 0; z < res.length; z++) {
      restMap[res[z].id] = res[z];
    }
    //查询对应客户
    var cusSql = " select id,code,name from aa.merchant.Merchant inner join  aa.merchant.MerchantApplyRange a  on  a.merchantId = id " + " where   id='" + agentId + "' ";
    if (orgid != null && orgid != "") {
      cusSql = cusSql + " and  a.orgId = '" + orgid + "' ";
    }
    var cusres = ObjectStore.queryByYonQL(cusSql, "productcenter");
    //查询销售员
    var empSql = " select id,code,name  from hred.staff.Staff  where unitId = '" + orgid + "' ";
    if (orgid == "") {
      empSql = " select id,code,name  from hred.staff.Staff  ";
    }
    var empres = ObjectStore.queryByYonQL(empSql, "hrcloud-staff-mgr");
    let empMap = {};
    for (var x = 0; x < empres.length; x++) {
      empMap[empres[x].id] = empres[x];
    }
    let returndataMap = {};
    //查询退货单据列表
    var returnOrdersql =
      "select  a.orderNo orderNo,  sum(a.oriSum) oriSum from voucher.salereturn.SaleReturn " +
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
      returndataMap[orderNo] = oriSum;
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
    var sqlTuiKuan = "select orderno,oriSum   from arap.paybill.PayBill  where  billtype = 9   ";
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
    var sallSql =
      "select  id,code ,vouchdate ,payMoney, confirmPrice,auditDate,corpContact  from voucher.order.Order" +
      " where  nextStatus <> 'CONFIRMORDER'   and  payStatusCode <> 'CONFIRMPAYMENT_ALL' " + //and payStatusCode <> 'FINISHPAYMENT'
      "  and  agentId = '" +
      agentId +
      "'";
    if (orgid != "") {
      sallSql = sallSql + " and salesOrgId = '" + orgid + "' ";
    }
    if (deptid != "") {
      sallSql = sallSql + "  and  saleDepartmentId  = '" + deptid + "' ";
    }
    if (open_vouchdate_begin != null && open_vouchdate_begin != "") {
      sallSql = sallSql + " and vouchdate >=  '" + open_vouchdate_begin + "' ";
    }
    if (open_vouchdate_end != null && open_vouchdate_end != "") {
      sallSql = sallSql + " and vouchdate <=  '" + open_vouchdate_end + "' ";
    }
    sallSql = sallSql + "  order by vouchdate desc ";
    var sallres = ObjectStore.queryByYonQL(sallSql, "udinghuo");
    var recordList = [];
    for (var i = 0; i < sallres.length; i++) {
      var sallid = sallres[i].id;
      var sallcode = sallres[i].code;
      if (restMap[sallid] != null && restMap[sallid] != "") {
        var sallCheck = restMap[sallid];
        var thisData = {};
        thisData.code = sallres[i].code;
        thisData.id = sallid;
        var corpContact = sallres[i].corpContact;
        if (empMap[corpContact] != null && empMap[corpContact] != "") {
          var emp = empMap[corpContact];
          thisData.corpContactUserName = emp.name;
        } else {
          thisData.corpContactUserName = "";
        }
        thisData.agentId = cusres[0].name;
        thisData.vouchdate = sallres[i].vouchdate;
        thisData.extend_Overdue = sallCheck.accountDay;
        thisData.auditDate = sallres[i].auditDate;
        var allZhekou = 0;
        var allMoney = sallres[i].payMoney;
        var confirmPrice1 = 0;
        if (sallres[i].confirmPrice != null) {
          confirmPrice1 = sallres[i].confirmPrice;
        }
        thisData.returnmoney = 0;
        thisData.allMoney = allMoney;
        if (returndataMap[sallcode] != null && returndataMap[sallcode] != "") {
          var retrunAmount = returndataMap[sallcode];
          var payMoney = sallres[i].payMoney;
          var confirmPrice = 0;
          if (sallres[i].confirmPrice != null) {
            confirmPrice = sallres[i].confirmPrice;
          }
          if (payMoney != retrunAmount + confirmPrice) {
          }
          thisData.payMoney = sallres[i].payMoney - retrunAmount; //退货调整优化  20230910
          thisData.confirmPrice = sallres[i].confirmPrice;
          thisData.returnmoney = retrunAmount;
        } else {
          thisData.payMoney = sallres[i].payMoney;
          thisData.confirmPrice = sallres[i].confirmPrice;
        }
        if (tuiKuandataMap[sallcode] != null && tuiKuandataMap[sallcode] != "") {
          var tuikuanAmount = tuiKuandataMap[sallcode];
          if (tuikuanAmount > 0) {
            thisData.confirmPrice = thisData.confirmPrice - tuikuanAmount;
          } else {
            thisData.confirmPrice = thisData.confirmPrice + tuikuanAmount;
          }
        }
        var payNoYouhui = thisData.payMoney;
        if (zhekouMap[sallcode] != null && zhekouMap[sallcode] != "") {
          var youhuiAmount = zhekouMap[sallcode];
          allZhekou = allZhekou + youhuiAmount;
          if (youhuiAmount > 0) {
            thisData.payMoney = thisData.payMoney - youhuiAmount;
            thisData.confirmPrice = thisData.confirmPrice - youhuiAmount;
          } else {
            thisData.payMoney = thisData.payMoney + youhuiAmount;
            thisData.confirmPrice = thisData.confirmPrice + youhuiAmount;
          }
        }
        if (thisData.payMoney != thisData.confirmPrice) {
          recordList.push(thisData);
        }
      }
    }
    var data = {};
    data.pageIndex = pageIndex;
    data.pageSize = pageSize;
    data.recordCount = recordList.length;
    data.recordList = recordList;
    data.pageCount = resCount.length;
    data.beginPageIndex = pageIndex;
    data.endPageIndex = pageIndex;
    data.sss = sallres.length;
    return { data };
  }
}
exports({ entryPoint: MyAPIHandler });