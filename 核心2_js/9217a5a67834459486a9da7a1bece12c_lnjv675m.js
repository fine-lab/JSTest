let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let ownorg = request.ownorg;
    let table = "GT34544AT7.GT34544AT7.IndustryOwnOrg";
    let conditions = { parent: ownorg.id, sys_code: ownorg.sys_code + "AreaAdmin" };
    let res1 = ObjectStore.selectByMap(table, conditions);
    var currentUser = JSON.parse(AppContext()).currentUser;
    var tenantId = currentUser.tenantId;
    // 如果没有就创建区域性组织
    let res = {};
    if (res1.length === 0) {
      var new_org_id = ownorg.sys_orgId;
      let fun3 = extrequire("GT34544AT7.org.areaDeptInsert");
      request.par = new_org_id;
      request.code = ownorg.sys_code;
      request.name = ownorg.name;
      request._status = "Insert";
      let rs3 = fun3.execute(request);
      let result3 = rs3.res;
      res = result3;
    } else {
      let func1 = extrequire("GT34544AT7.dept.deptSearchById");
      request.id = res1[0].sys_orgId;
      let res2 = func1.execute(request).res;
      res = res2;
    }
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });