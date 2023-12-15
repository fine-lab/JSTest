let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let res = [];
    let request = {};
    let getSysStaff = (staffid) => {
      let func1 = extrequire("GT34544AT7.staff.showStaffById");
      request.id = staffid;
      let resx = func1.execute(request);
      return resx;
    };
    let func1 = extrequire("GT34544AT7.ownUser.showOwnUserByTelOrEm");
    request.mobile = "+86-13881561668";
    let reslist = func1.execute(request).res;
    let staff_id = reslist[0].staff_id;
    let ss = getSysStaff(staff_id).res.data;
    if (ss.enable === 1) {
      // 如果员工启用，查询有没有这个用户
      let func2 = extrequire("GT34544AT7.user.isUserIn");
      request.mobile = "13881561668";
      let res2 = func2.execute(request).res;
      res = res2;
    }
    // 钟登学
    // 李雨桐
    return { res };
  }
}
exports({ entryPoint: MyTrigger });