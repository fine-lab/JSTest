let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var Overdue = request.Overdue;
    var agentName = request.agentName;
    var corpContact = request.corpContact;
    var orgid = "";
    var deptid = "";
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
      " from voucher.order.Order  left join voucher.order.PaymentExeDetail   a on  a.mainid = id  " +
      " where nextStatus <> 'CONFIRMORDER' and payStatusCode <> 'CONFIRMPAYMENT_ALL' " + // and payStatusCode <> 'FINISHPAYMENT'
      "   and  (a.vouchtype='voucher_order'  or a.vouchtype= null)  and  extendisxcx ='是'   "; //
    if (orgid != null && orgid != "") {
      sql = sql + " and salesOrgId = '" + orgid + "' ";
    }
    if (deptid != null && deptid != "") {
      sql = sql + "  and  saleDepartmentId  = '" + deptid + "'  ";
    }
    if (agentName != null && agentName != "") {
      sql = sql + " and extendcusname like '" + agentName + "' ";
    }
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var dateStr = [year, "-", month, "-", day].join("");
    if (Overdue) {
      if (Overdue == 1) {
        sql += " and   ifnull(a.expiringDateTime,auditDate)  =  '" + dateStr + " 00:00:00'   ";
      } else if (Overdue == 2) {
        sql += " and   ifnull(a.expiringDateTime,auditDate)  <  '" + dateStr + " 00:00:00'   ";
      } else if (Overdue == 3) {
        sql += " and   ifnull(a.expiringDateTime,auditDate)  >  '" + dateStr + " 00:00:00'   ";
      }
    }
    if (corpContact) {
      sql += " and corpContact = '" + corpContact + "' ";
    }
    sql += " order  by  code desc "; // group by agentId
    var agentSql = " select  distinct agentId   " + sql;
    var res = [];
    var salCount = "select   count(1) num " + sql;
    var resCou = ObjectStore.queryByYonQL(salCount, "udinghuo");
    var sallCount = resCou[0].num;
    if (sallCount > 5000) {
      let x = new Big(sallCount);
      let y = new Big(5000);
      let z = x.div(y);
      var maxpage = Math.ceil(z);
      for (var h = 1; h <= maxpage; h++) {
        var newsql = "select    agentId,  code, salesOrgId, (confirmPrice-payMoney) payMoney , id  , payMoney allMoney, confirmPrice   " + sql + " limit " + h + " ,5000 ";
        var resThis = ObjectStore.queryByYonQL(newsql, "udinghuo");
        for (var g = 0; g < resThis.length; g++) {
          res.push(resThis[g]);
        }
      }
    } else {
      sql = "select    agentId,  code, salesOrgId, (confirmPrice-payMoney) payMoney , id  , payMoney allMoney, confirmPrice   " + sql;
      res = ObjectStore.queryByYonQL(sql, "udinghuo");
    }
    var agentres = ObjectStore.queryByYonQL(agentSql, "udinghuo");
    var BaseOrgsql = "select * from org.func.BaseOrg where  id = '" + orgid + "' "; //
    if (orgid == "") {
      BaseOrgsql = " select * from org.func.BaseOrg  ";
    }
    var BaseOrgres = ObjectStore.queryByYonQL(BaseOrgsql, "ucf-org-center");
    var Merchantsql = "select * from aa.merchant.Merchant";
    var Merchantres = ObjectStore.queryByYonQL(Merchantsql, "productcenter");
    let returndataMap = {};
    //查询退货金额单据列表
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
    var restemp = [];
    for (var i = 0; i < agentres.length; i++) {
      var needAdd = true;
      agentres[i].salesOrgId = orgid;
      for (var j = 0; j < BaseOrgres.length; j++) {
        if (orgid == BaseOrgres[j].id) {
          agentres[i].salesOrgName = BaseOrgres[j].name;
          break;
        }
      }
      for (var j = 0; j < res.length; j++) {
        if (agentres[i].agentId == res[j].agentId) {
          var code = res[j].code;
          var allMoney = res[j].allMoney;
          var allZhekou = 0;
          if (returndataMap[code] != null && returndataMap[code] != "") {
            var retrunAmount = returndataMap[code];
            allZhekou = allZhekou + retrunAmount; //退货调整优化  20230910
            var payMoney = res[j].payMoney;
            var lastAmount = retrunAmount + payMoney; //退货调整优化  20230910
            if (agentres[i].payMoney == null || agentres[i].payMoney == "") {
              agentres[i].payMoney = lastAmount;
            } else {
              var payMoney = agentres[i].payMoney;
              agentres[i].payMoney = payMoney + lastAmount;
            }
          } else {
            if (agentres[i].payMoney == null || agentres[i].payMoney == "") {
              agentres[i].payMoney = res[j].payMoney;
            } else {
              var payMoney = agentres[i].payMoney;
              agentres[i].payMoney = payMoney + res[j].payMoney;
            }
          }
          if (zhekouMap[code] != null && zhekouMap[code] != "") {
            var youhuiAmount = zhekouMap[code];
            if (youhuiAmount > 0) {
            } else {
            }
          }
          var confireAmount = res[j].confirmPrice;
          if (tuiKuandataMap[code] != null && tuiKuandataMap[code] != "") {
            var tuikuanAmount = tuiKuandataMap[code];
            if (tuikuanAmount > 0) {
              confireAmount = confireAmount - tuikuanAmount;
            } else {
              confireAmount = confireAmount + tuikuanAmount;
            }
          }
          if (allMoney - allZhekou - confireAmount == 0) {
            if (agentres[i].paycount == null || agentres[i].paycount == "") {
              agentres[i].paycount = 0;
            } else {
              var num = agentres[i].paycount;
              agentres[i].paycount = num + 0;
            }
          } else {
            if (agentres[i].paycount == null || agentres[i].paycount == "") {
              agentres[i].paycount = 1;
            } else {
              var num = agentres[i].paycount;
              agentres[i].paycount = num + 1;
            }
          }
        }
      }
      for (var j = 0; j < Merchantres.length; j++) {
        if (agentres[i].agentId == Merchantres[j].id) {
          agentres[i].agentName = Merchantres[j].name;
          break;
        }
      }
      if (needAdd) {
        if (!agentName) {
          restemp.push(agentres[i]);
        } else if (agentres[i].agentName.includes(agentName)) {
          restemp.push(agentres[i]);
        }
      }
    }
    return { restemp };
  }
}
exports({ entryPoint: MyAPIHandler });