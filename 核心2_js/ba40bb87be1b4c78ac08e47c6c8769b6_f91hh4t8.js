let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let user = ObjectStore.user();
    let orgSql = "select * from org.func.BaseOrg where id=" + user.orgId;
    var org = ObjectStore.queryByYonQL(orgSql, "ucf-org-center"); //
    const bankSql = "select * from bd.enterprise.OrgFinBankacctVO where orgid=" + user.orgId + " and enable=1"; // where orgid='youridHere' and enable=1';
    var bank = ObjectStore.queryByYonQL(bankSql, "ucfbasedoc"); //
    const deptSql = "select * from bd.adminOrg.DeptOrgVO where id=" + user.deptId;
    var dept = ObjectStore.queryByYonQL(deptSql, "orgcenter"); //
    return { user, org, dept, bank };
  }
}
exports({
  entryPoint: MyAPIHandler
});