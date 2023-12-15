let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let orgId = ObjectStore.user().orgId;
    let sql2 = "select * from bd.enterprise.OrgFinBankacctVO where orgid=" + orgId + "";
    const bankSql = "select * from bd.enterprise.OrgFinBankacctVO where orgid=" + request.value1 + " and  acctType=0 and enable=1"; // where orgid='youridHere' and enable=1';
    const bankSql1 = "select * from bd.enterprise.OrgFinBankacctVO where orgid=" + request.value1 + " and  enable=1"; // where orgid='youridHere' and enable=1';
    var bank = ObjectStore.queryByYonQL(bankSql, "ucfbasedoc"); //
    if (bank == undefined || bank[0] == undefined) {
      bank = ObjectStore.queryByYonQL(bankSql1, "ucfbasedoc"); //
    }
    var res2 = ObjectStore.queryByYonQL(sql2, "ucfbasedoc");
    let sql3 = "select * from aa.merchant.Merchant where name ='" + request.value + "'";
    var res3 = ObjectStore.queryByYonQL(sql3, "productcenter");
    let id = res3[0].id;
    let sql = "select * from aa.merchant.AgentFinancial where merchantId =" + id;
    var res = ObjectStore.queryByYonQL(sql, "productcenter");
    let openBank = res[0].openBank;
    let sql1 = "select * from bd.bank.BankDotVO where id =" + openBank;
    var res1 = ObjectStore.queryByYonQL(sql1, "ucfbasedoc");
    let sql4 = "select * from bd.enterprise.OrgFinBankacctVO where orgid =" + orgId;
    var res4 = ObjectStore.queryByYonQL(sql4, "ucfbasedoc");
    return { res, res1, res2, res3, sql, res4, bank };
  }
}
exports({ entryPoint: MyAPIHandler });