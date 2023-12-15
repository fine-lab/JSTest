let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let { staffId, orgId, deptId } = request;
    function getdate() {
      let date = new Date();
      var currTimestamp = date.getTime();
      var targetTimestamp = currTimestamp + 8 * 3600 * 1000;
      date = new Date(targetTimestamp);
      let y = date.getFullYear();
      let m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      let d = date.getDate();
      d = d < 10 ? "0" + d : d;
      let hh = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
      let mm = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
      let ss = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
      var begindate = y + "-" + m + "-" + d + " " + hh + ":" + mm + ":" + ss;
      return begindate;
    }
    // 查找员工信息
    let func1 = extrequire("GT34544AT7.staff.showStaffById");
    request.id = staffId;
    let ss = func1.execute(request);
    let accept = ss.res;
    let staffinfo = accept.data;
    // 获取主兼职信息
    var { mainJobList, ptJobList } = staffinfo;
    // 主任职切换
    if (!!mainJobList) {
      let repeat = false;
      let repeattarget = null;
      var mainJobList1 = [];
      for (let i = 0; i < mainJobList.length; i++) {
        let mainJob = mainJobList[i];
        if (mainJob.enddate == undefined && mainJob.org_id !== orgId && mainJob.dept_id !== deptId) {
          let nmainjob = {
            id: mainJob.id,
            staff_id: mainJob.staff_id,
            org_id: mainJob.org_id,
            dept_id: mainJob.dept_id,
            begindate: mainJob.begindate,
            enddate: getdate(),
            _status: "Update"
          };
          mainJobList1.push(nmainjob);
        } else if (mainJob.org_id == orgId && mainJob.dept_id == deptId) {
          repeat = true;
          repeattarget = mainJob;
        }
      }
      if (!repeat) {
        mainJobList1.push({
          staff_id: staffId,
          org_id: orgId,
          dept_id: deptId,
          begindate: getdate(),
          _status: "Insert"
        });
      } else {
        mainJobList1.push({
          id: repeattarget.id,
          staff_id: staffId,
          org_id: orgId,
          dept_id: deptId,
          begindate: getdate(),
          _status: "Update"
        });
      }
      let sss = {
        _status: "Update",
        code: staffinfo.code,
        enable: 1,
        id: staffId,
        mainJobList: mainJobList1,
        mobile: staffinfo.mobile,
        name: staffinfo.name
      };
      var jsonstr = { data: sss };
      let staffSave = extrequire("GT34544AT7.staff.createStaff");
      request.body = jsonstr;
      let resStaffSave = staffSave.execute(request);
      res = resStaffSave.res.res;
    }
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });