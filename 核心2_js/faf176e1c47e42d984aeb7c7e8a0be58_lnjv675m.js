let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 获取当前用户的用户信息
    let res1 = JSON.parse(AppContext());
    let staffId = res1.currentUser.staffId;
    let func1 = extrequire("GT34544AT7.staff.showStaffInfoByIdCd");
    let res = func1.execute({ id: staffId });
    let mainJobList = res.res.data.mainJobList;
    let deptArr = [];
    for (let i = 0; i < mainJobList.length; i++) {
      let manJob = mainJobList[i];
      if (manJob.enddate === undefined) {
        if (request.org_id !== undefined) {
          let org_id = request.org_id;
          if (manJob.org_id === org_id) {
            deptArr.push(manJob.dept_id);
          }
        } else {
          deptArr.push(manJob.dept_id);
        }
      }
    }
    let ptJobList = res.res.data.ptJobList;
    if (ptJobList) {
      for (let j = 0; j < ptJobList.length; j++) {
        let ptJob = ptJobList[j];
        if (ptJob.enddate === undefined) {
          if (request.org_id !== undefined) {
            let org_id = request.org_id;
            if (ptJob.org_id === org_id) {
              deptArr.push(ptJob.dept_id);
            }
          } else {
            deptArr.push(ptJob.dept_id);
          }
        }
      }
    }
    return { deptArr };
  }
}
exports({ entryPoint: MyAPIHandler });