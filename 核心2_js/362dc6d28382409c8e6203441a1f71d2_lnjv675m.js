let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 行业组织管理组织
    var c_org_dep = request.c_org_dep;
    c_org_dep.C_org_id = request.id;
    let fun1 = extrequire("GT30667AT8.usertable.C_org_dep_Insert");
    request.object = c_org_dep;
    let fun1res = fun1.execute(request).res;
    var c_org_dep_id = fun1res.id;
    // 行业组织管理人员
    var c_org_user = request.c_org_user;
    c_org_user.C_org_id = request.id;
    c_org_user.C_org_dep = c_org_dep_id;
    let fun2 = extrequire("GT30667AT8.usertable.C_org_user_Insert");
    request.object = c_org_user;
    let fun2res = fun2.execute(request).res;
    // 行业组织行业成员组织
    var c_org_orglist = request.c_org_orglist;
    c_org_orglist.C_org_id = request.id;
    let fun3 = extrequire("GT30667AT8.usertable.C_org_orglist_Insert");
    request.object = c_org_orglist;
    let fun3res = fun3.execute(request).res;
    var a_org_admin = request.a_org_admin.res;
    var c_org = request.c_org;
    var user_id = a_org_admin.id;
    // 插入管理员表
    var C_org_admin = {
      sys_org_id: c_org.sys_org_id,
      C_org_id: request.id,
      user_id: user_id,
      sys_org_dept_id: c_org_dep.sys_orgid
    };
    let fun6 = extrequire("GT30667AT8.usertable.C_org_admin_Insert");
    request.object = C_org_admin;
    let fun6res = fun6.execute(request).res;
    // 行业组织个人成员组织
    var c_org_member = request.c_org_member;
    c_org_member.C_org_id = request.id;
    let fun4 = extrequire("GT30667AT8.usertable.C_org_member_Insert");
    request.object = c_org_member;
    let fun4res = fun4.execute(request).res;
    var res = {
      c_org_dep: fun1res,
      c_org_user: fun2res,
      c_org_orglist: fun3res,
      c_org_member: fun4res,
      c_org_admin: fun6res
    };
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });