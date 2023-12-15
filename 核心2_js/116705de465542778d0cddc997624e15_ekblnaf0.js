let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var agentName = request.agentName;
    var orgid = request.orgid;
    var dept = request.dept;
    let qichuMap = {};
    var aaaql =
      " select  customer, sum(localbalance) localbalance  from      arap.oar.OarMain  where    localbalance != 0   " + //'1624184918710943750'
      " and  basebilltype ='HSFWYSGLYY1' and  tradetype = '1602907650714501185'     and  period = '1629351300511563787' ";
    if (orgid != null && orgid != "") {
      aaaql = aaaql + " and accentity = '" + orgid + "' ";
    }
    aaaql = aaaql + "  group by  customer  ";
    var yingshouRes1 = ObjectStore.queryByYonQL(aaaql, "fiarap");
    for (var q = 0; q < yingshouRes1.length; q++) {
      var customer = yingshouRes1[q].customer;
      var localbalance = yingshouRes1[q].localbalance;
      qichuMap[customer] = localbalance;
    }
    var Merchantsql = "select  id,name from aa.merchant.Merchant";
    if (agentName != null && agentName != "") {
      Merchantsql = Merchantsql + " where name like '" + agentName + "' ";
    }
    var Merchantres = ObjectStore.queryByYonQL(Merchantsql, "productcenter");
    let merchantresMap = {};
    for (var w = 0; w < Merchantres.length; w++) {
      var id = Merchantres[w].id;
      var name = Merchantres[w].name;
      merchantresMap[id] = name;
    }
    var restemp = [];
    var yingshouSql =
      "select  customer , sum(b.balance) localbalance  from  arap.oar.OarMain " +
      " inner join arap.oar.OarDetail b  on  id= b.mainid " +
      " where  localbalance != 0 and tradetype = '1602907650714501262' and  customer != '1633822224027746335'  ";
    if (orgid != null && orgid != "") {
      yingshouSql = yingshouSql + " and accentity = '" + orgid + "' ";
    }
    if (dept != null && dept != "") {
      if (dept == "1624335113728294928" || dept == "1624335113728294932") {
        yingshouSql = yingshouSql + " and  b.dept in ('1624335113728294928','1624335113728294932') ";
      } else {
        yingshouSql = yingshouSql + " and  b.dept  = '" + dept + "' ";
      }
    }
    yingshouSql = yingshouSql + " group by  customer ";
    var yingshouRes = ObjectStore.queryByYonQL(yingshouSql, "fiarap");
    for (var i = 0; i < yingshouRes.length; i++) {
      var cusid = yingshouRes[i].customer;
      if (merchantresMap[cusid] != null && merchantresMap[cusid] != "") {
        var cusObj = {};
        cusObj.customerid = cusid;
        cusObj.customername = merchantresMap[cusid];
        cusObj.balance = yingshouRes[i].localbalance;
        if (qichuMap[cusid] != null && qichuMap[cusid] != "") {
          cusObj.qichubalance = qichuMap[cusid];
          cusObj.allbalance = cusObj.qichubalance + cusObj.balance;
        }
        restemp.push(cusObj);
      }
    }
    return { restemp };
  }
}
exports({ entryPoint: MyAPIHandler });