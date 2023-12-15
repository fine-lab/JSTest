let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 行业组织成员组织
    var a_org_dep = request.a_org_dep;
    a_org_dep.A_org_id = request.id;
    let fun5 = extrequire("GT30667AT8.usertable.A_org_dep_Insert");
    request.object = a_org_dep;
    let fun5res = fun5.execute(request).res;
    var a_org_dep_id = fun5res.id;
    // 行业组织管理人员
    var a_org_user = request.a_org_user;
    a_org_user.A_org_id = request.id;
    a_org_user.A_org_dep = a_org_dep_id;
    let fun4 = extrequire("GT30667AT8.usertable.A_org_user_Insert");
    request.object = a_org_user;
    let fun4res = fun4.execute(request).res;
    var user_id = fun4res.userid;
    let fun7 = extrequire("GT30667AT8.user.searchRegisterByuid");
    request.id = user_id;
    let fun7res = fun7.execute(request).res;
    // 插入管理员表
    var A_org_admin = {
      sys_org_id: request.up_orgid,
      sys_org_dept_id: request.sys_orgid,
      A_org_id: request.id,
      user_id: res7.id
    };
    let fun6 = extrequire("GT30667AT8.usertable.A_org_admin_Insert");
    request.object = A_org_admin;
    let fun6res = fun6.execute(request).res;
    var res = {
      a_org_dep: fun5res,
      a_org_user: fun4res,
      a_org_admin: fun6res
    };
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });