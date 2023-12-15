let AbstractTrigger = require("AbstractTrigger");
let queryUtils = extrequire("GT52668AT9.CommonUtils.QueryUtils");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    return {};
  }
  //查询员工id
  getStaffId(name) {
    let res = queryUtils.getIdByName("bd.staff.StaffNew", name, "ucf-staff-center");
    return res;
  }
}
exports({ entryPoint: MyTrigger });