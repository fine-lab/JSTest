let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var user_id = request.id;
    // 获取当前用户的userid
    let fun = extrequire("GT30667AT8.org.orgSearchByUserId");
    let result = fun.execute(request);
    var main_org_id = result.main_org_id;
    // 以此userid用户的组织作为创建新组织的上级
    let fun1 = extrequire("GT30667AT8.org.orgInsert");
    request.par = main_org_id;
    let result1 = fun1.execute(request);
    var res1 = result1.res;
    // 获取新建组织的id
    var new_org_id = res1.data.id;
    let fun3 = extrequire("GT30667AT8.org.orgInsert");
    request.code = request.code + "-1";
    request.name = request.name + "人力资源部";
    request.companytype_name = "事业部";
    request.orgtype = true;
    request.par = new_org_id;
    let result3 = fun3.execute(request);
    var res2 = result3.res;
    var dept_id = res2.data.id;
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
    var ptJobList = [];
    ptJobList[0] = {
      org_id: new_org_id,
      dept_id: dept_id,
      begindate: begindate,
      _status: "Insert"
    };
    request = {};
    // 用户加入兼职信息
    let fun2 = extrequire("GT30667AT8.user.addPtJobbyUserid");
    request.id = user_id;
    request.ptJobList = ptJobList;
    let result2 = fun2.execute(request);
    var res = result2.res;
    return { org: res1, dept: res2, res: res };
  }
}
exports({ entryPoint: MyAPIHandler });