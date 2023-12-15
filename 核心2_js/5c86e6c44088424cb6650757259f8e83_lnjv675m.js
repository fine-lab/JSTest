let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var user_id = request.id;
    var basename = request.name;
    var basecode = request.code;
    // 获取当前用户的组织id
    let fun = extrequire("GT30667AT8.org.orgSearchByUserId");
    let result = fun.execute(request);
    var main_org_id = result.main_org_id;
    // 获取用户员工信息
    let fun1 = extrequire("GT30667AT8.user.searchWorkerByApi");
    let result1 = fun1.execute(request).res.res;
    var workerid = result1.data.data[0].id;
    var code = result1.data.data[0].code;
    // 新协会顶级
    let fun2 = extrequire("GT30667AT8.org.orgInsert");
    request.par = main_org_id;
    let result2 = fun2.execute(request).res;
    // 获取新建组织的id
    var new_org_id = result2.data.id;
    // 协会内部组织
    let fun3 = extrequire("GT30667AT8.org.orgInsert");
    request.code = basecode + "-main";
    request.name = basename + "组织部门";
    request.companytype_name = "内设部门";
    request.orgtype = true;
    request.par = new_org_id;
    let result3 = fun3.execute(request).res;
    var dept_id = result3.data.id;
    // 加入此协会管理组织
    // 加入此协会个人
    let fun5 = extrequire("GT30667AT8.org.orgInsert");
    request.code = basecode + "-memberlist";
    request.name = basename + "会员组织";
    request.companytype_name = "其他组织";
    request.par = new_org_id;
    request.orgtype = true;
    let result5 = fun5.execute(request).res;
    var human_id = result5.data.id;
    var res = {
      c_org: result2.data,
      c_org_dep: result3.data,
      c_org_member: result5.data,
      c_org_user: result1.data.data[0]
    };
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });