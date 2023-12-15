let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var user_id = request.id;
    // 获取当前用户的组织id
    let fun = extrequire("GT30667AT8.org.orgSearchByUserId");
    let result = fun.execute(request);
    var main_org_id = result.main_org_id;
    // 获取用户员工信息
    let fun1 = extrequire("GT30667AT8.user.searchWorkerByApi");
    let result1 = fun1.execute(request).res.res;
    var workerid = result1.data.data[0].id;
    var code = result1.data.data[0].code;
    // 以此userid用户的组织作为创建新组织的上级
    let fun2 = extrequire("GT30667AT8.org.orgInsert");
    request.par = main_org_id;
    let result2 = fun2.execute(request).res;
    // 获取新建组织的id
    var new_org_id = result2.data.id;
    let fun3 = extrequire("GT30667AT8.org.orgInsert");
    request.code = request.code + "-1";
    request.name = request.name + "人力资源部";
    request.companytype_name = "事业部";
    request.orgtype = true;
    request.par = new_org_id;
    let result3 = fun3.execute(request).res;
    var dept_id = result3.data.id;
    var a_org_user = {
      code: code,
      name: result1.data.data[0].name,
      sys_orgid: new_org_id,
      sys_depid: dept_id,
      userid: user_id,
      sys_StaffNew: workerid,
      A_org_dep: dept_id,
      A_org_id: new_org_id
    };
    var a_org_dep = {
      dep_code: result3.data.code,
      dep_name: result3.data.name.zh_CN,
      sys_orgid: dept_id,
      up_orgid: new_org_id,
      tingyongbiaoshi: result3.data.enable,
      A_org_id: new_org_id
    };
    // 行业组织成员组织
    // 行业组织管理人员
    var res = {
      a_org_user: a_org_user,
      a_org_dep: a_org_dep,
      sys_orgid: dept_id,
      up_orgid: new_org_id
    };
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });