let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let res = [];
    let dept = [];
    let main_org_id = null;
    let main_dept_id = null;
    // 获取当前用户和租户id
    let func1 = extrequire("GT39696AT9.user.getAppContext");
    let res1 = func1.execute(request).res;
    let context = res1.currentUser;
    let userId = context.id;
    let tenantId = context.tenantId;
    // 获取当前用户员工信息
    let func2 = extrequire("GT39696AT9.staff.showStaffByUserId");
    request.id = userId;
    let res2 = func2.execute(request).res;
    if (res2.data.status === 0) {
      throw new Error("当前用户未绑定员工");
    }
    let staffId = res2.data.data[0].id;
    let staffCode = res2.data.data[0].code;
    // 获取员工详细信息
    let func3 = extrequire("GT39696AT9.staff.showStaffInfoByIdCd");
    request.id = staffId;
    let res3 = func3.execute(request).res;
    // 获取员工兼职列表和主职信息;
    let mainJobList = res3.data.mainJobList;
    let ptJobList = res3.data.ptJobList;
    if (ptJobList === undefined || ptJobList === null || ptJobList.length === 0) {
      throw new Error("当前用户没有兼职信息");
    }
    for (let i = 0; i < ptJobList.length; i++) {
      let ptJob = ptJobList[i];
      // 获取员工主职业务单元和部门
      let org_id = ptJob.org_id;
      let dept_id = ptJob.dept_id;
      if (!includes(res, org_id)) res.push(org_id);
      if (!includes(dept, dept_id)) dept.push(dept_id);
    }
    return { res: res, dept: dept };
  }
}
exports({ entryPoint: MyAPIHandler });