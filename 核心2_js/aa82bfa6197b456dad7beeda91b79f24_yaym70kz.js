let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var res = AppContext();
    let dd = request.value;
    let staffId = ObjectStore.user().staffId;
    let staffname = ObjectStore.user().name;
    let orgId = ObjectStore.user().orgId;
    let staffSql = "select dept_id from bd.staff.StaffJob where 	staff_id=" + staffId;
    //部门id
    var staff = ObjectStore.queryByYonQL(staffSql, "ucf-staff-center"); //
    let pdeptid = staff[0].dept_id;
    //部门名称
    let dept = "select * from bd.adminOrg.AdminOrgVO where id=" + pdeptid;
    var deptnames = ObjectStore.queryByYonQL(dept, "ucf-org-center");
    let deptname = deptnames[0].name; //
    //组织名称
    let org = "select name from org.func.BaseOrg where id=" + orgId;
    var orgnames = ObjectStore.queryByYonQL(org, "ucf-org-center"); //
    let orgname = orgnames[0].name;
    //开户行
    let bank = "select bankNumber,	acctName from bd.enterprise.OrgFinBankacctVO where orgid=" + orgId;
    var banknames = ObjectStore.queryByYonQL(bank, "ucfbasedoc"); //
    let bankid = banknames[0].bankNumber;
    let bankname = banknames[0].acctName;
    return { pdeptid, deptname, orgname, orgId, staffId, staffname, bankname };
  }
}
exports({ entryPoint: MyAPIHandler });