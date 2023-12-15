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
      " where nextStatus <> 'CONFIRMORDER'  and payStatusCode <> 'FINISHPAYMENT' and payStatusCode <> 'CONFIRMPAYMENT_ALL' " +
      "   and  (a.vouchtype='voucher_order'  or a.vouchtype= null)  and  extendisxcx ='是' ";
    if (orgid != null && orgid != "") {
      sql = sql + " and salesOrgId = '" + orgid + "' ";
    }
    if (deptid != null && deptid != "") {
      sql = sql + "  and  saleDepartmentId  = '" + deptid + "'  ";
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
    sql += " order  by  agentId "; // group by agentId
    var agentSql = " select  distinct agentId   " + sql;
    sql = "select    agentId,  code, salesOrgId, (confirmPrice-payMoney) payMoney , id  , payMoney allMoney, confirmPrice   " + sql;
    var res = ObjectStore.queryByYonQL(sql, "udinghuo");
    var agentres = ObjectStore.queryByYonQL(agentSql, "udinghuo");
    var BaseOrgsql = "select * from org.func.BaseOrg where  id = '" + orgid + "' "; //
    if (orgid == "") {
      BaseOrgsql = " select * from org.func.BaseOrg  ";
    }
    var BaseOrgres = ObjectStore.queryByYonQL(BaseOrgsql, "ucf-org-center");
    var Merchantsql = "select * from aa.merchant.Merchant";
    var Merchantres = ObjectStore.queryByYonQL(Merchantsql, "productcenter");
    let returndataMap = {};
    //查询单据列表
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
          var confirmPrice = res[j].confirmPrice;
          var allZhekou = 0;
          if (returndataMap[code] != null && returndataMap[code] != "") {
            var retrunAmount = returndataMap[code];
            var payMoney = res[j].payMoney;
            var lastAmount = payMoney; //退货调整优化  20230910新增
            if (lastAmount < 0) {
              if (agentres[i].payMoney == null || agentres[i].payMoney == "") {
                agentres[i].payMoney = lastAmount;
              } else {
                var payMoney = agentres[i].payMoney;
                agentres[i].payMoney = payMoney + lastAmount;
              }
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
            allZhekou = allZhekou + youhuiAmount;
            if (youhuiAmount > 0) {
              agentres[i].payMoney = agentres[i].payMoney + youhuiAmount;
            } else {
              agentres[i].payMoney = agentres[i].payMoney - youhuiAmount;
            }
          }
          if (allMoney == allZhekou + confirmPrice) {
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