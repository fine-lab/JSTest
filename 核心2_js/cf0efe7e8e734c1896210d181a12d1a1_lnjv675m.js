let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let date = new Date();
    let y = date.getFullYear();
    let m = date.getMonth() + 1;
    m = m < 10 ? "0" + m : m;
    let d = date.getDate();
    d = d < 10 ? "0" + d : d;
    let hh = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    let mm = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    let ss = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
    let begindate = y + "-" + m + "-" + d + " " + hh + ":" + mm + ":" + ss;
    let request = {};
    let id = request.userid;
    let ptJobList = [];
    ptJobList[0] = {
      org_id: param.data[0].org_joinList[0]["sys_org_join_id"],
      dept_id: param.data[0].org_joinList[0]["sys_dept_join_id"],
      begindate: begindate,
      _status: "Insert"
    };
    let request = {};
    // 系统新增兼职信息
    let func1 = extrequire("GT34544AT7.staff.addPtJobByUid");
    request.ptJobList = ptJobList;
    let res = func1.execute(request);
    return { res };
  }
}
exports({ entryPoint: MyTrigger });