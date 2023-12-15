let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var date = new Date();
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? "0" + m : m;
    var d = date.getDate();
    d = d < 10 ? "0" + d : d;
    var hh = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    var mm = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    var ss = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
    var begindate = y + "-" + m + "-" + d + " " + hh + ":" + mm + ":" + ss;
    var id = request.userid;
    var ptJobList = [];
    ptJobList[0] = {
      org_id: request.org_id,
      dept_id: request.dept_id,
      begindate: begindate,
      _status: "Insert"
    };
    // 系统新增兼职信息
    let func1 = extrequire("GT34544AT7.staff.addPtJobByUid");
    request.ptJobList = ptJobList;
    let res1 = func1.execute(request);
    // 自建表新增兼职信息
    let func2 = extrequire("GT34544AT7.ownUser.ownOrgJoinInstert");
    let res2 = func2.execute(request);
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });