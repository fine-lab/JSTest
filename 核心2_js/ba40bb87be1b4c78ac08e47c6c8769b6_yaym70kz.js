let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let user = ObjectStore.user();
    let tenant = ObjectStore.user();
    const userdataSql = "select * from bd.staff.StaffPtJob where dr=0 and staff_id=" + user.staffId;
    var userdata = ObjectStore.queryByYonQL(userdataSql, "ucf-staff-center"); //
    var orgid;
    var deptid;
    const mainjobSql = "select * from bd.staff.StaffMainJob where dr=0 and staff_id=" + user.staffId;
    var mainjob = ObjectStore.queryByYonQL(mainjobSql, "ucf-staff-center"); //
    var rr;
    if (userdata && userdata[0] && "1668881079986552853" !== mainjob[0].org_id) {
      for (let f = 0; f < userdata.length; f++) {
        if (userdata[f].enddate == undefined) {
          orgid = userdata[f].org_id;
          user.orgId = orgid;
          deptid = userdata[f].dept_id;
          user.deptId = deptid;
        }
      }
    } else {
      if (mainjob && mainjob[0]) {
        rr = 9;
        for (let g = 0; g < mainjob.length; g++) {
          if (mainjob[g].enddate == undefined) {
            rr = g;
            orgid = mainjob[g].org_id;
            deptid = mainjob[g].dept_id;
          }
        }
      } else {
        orgid = user.orgId;
        deptid = user.deptId;
      }
    }
    let orgSql = "select * from org.func.BaseOrg where id=" + orgid;
    var org = ObjectStore.queryByYonQL(orgSql, "ucf-org-center"); //
    const bankSql = "select * from bd.enterprise.OrgFinBankacctVO where orgid=" + orgid + " and  acctType=0 and enable=1"; // where orgid='youridHere' and enable=1';
    const bankSql1 = "select * from bd.enterprise.OrgFinBankacctVO where orgid=" + orgid + " and  enable=1"; // where orgid='youridHere' and enable=1';
    var bank = ObjectStore.queryByYonQL(bankSql, "ucfbasedoc"); //
    if (bank == undefined || bank[0] == undefined) {
      bank = ObjectStore.queryByYonQL(bankSql1, "ucfbasedoc"); //
    }
    const deptSql = "select * from bd.adminOrg.DeptOrgVO where id=" + deptid;
    var dept = ObjectStore.queryByYonQL(deptSql, "orgcenter"); //
    var bankkai;
    if (bank && bank[0]) {
      const bankkaisql = "select * from bd.bank.BankDotVO where id=" + bank[0].bankNumber;
      bankkai = ObjectStore.queryByYonQL(bankkaisql, "ucfbasedoc"); //
    }
    return { user, org, dept, bank, bankkai, userdata, tenant, mainjob, rr };
  }
}
exports({
  entryPoint: MyAPIHandler
});