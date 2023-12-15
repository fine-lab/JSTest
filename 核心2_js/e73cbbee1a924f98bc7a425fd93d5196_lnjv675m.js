let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let sysstop = [];
    let ownstop = [];
    let app = request.data;
    var apporg = { OrgCode: app.OrgCode };
    var gxsorgs = ObjectStore.selectByMap("GT34544AT7.GT34544AT7.GxsOrg", apporg);
    var gxsorg = gxsorgs[0];
    // 停用系统组织
    let id = gxsorg.sysOrg;
    request.id = id;
    let func1 = extrequire("GT34544AT7.dept.searchSubordinate");
    let sydepts = func1.execute(request).res;
    // 获取她的下级部门
    let depts = sydepts.res.data;
    for (let i in depts) {
      let dept = depts[i];
      if (!!dept.children && dept.children.length > 0) {
        throw new Error("此次停用涉及多级部门，请将系统末级部门依次停用");
      } else {
        request.id = dept.id;
        let func2 = extrequire("GT34544AT7.dept.deptStop");
        let res2 = func2.execute(request);
        sysstop.push(res2);
      }
    }
    // 停用系统组织
    request.id = gxsorg.sysOrg;
    let orgstop = extrequire("GT34544AT7.org.orgStop");
    let orgstopres = orgstop.execute(request);
    // 停用下级自建组织
    let condition = { parent: gxsorg.id };
    var gxsOrg = ObjectStore.selectByMap("GT34544AT7.GT34544AT7.GxsOrg", condition);
    for (let i in gxsOrg) {
      let obj = gxsOrg[i];
      var object = { id: obj.id, enable: 0 };
      var ss = ObjectStore.updateById("GT34544AT7.GT34544AT7.GxsOrg", object, "6626a362");
      ownstop.push(ss);
    }
    // 停用自身
    let res = {
      sys: sysstop,
      local: ownstop
    };
    // 停用
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });