let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let id = request.id;
    var apporg = { id: id };
    let apparr = ObjectStore.selectByMap("GT34544AT7.GT34544AT7.GxsOrg", apporg);
    var app = apparr[0];
    request = {};
    let fun2 = extrequire("GT34544AT7.org.orgInsert");
    request.enable = 1;
    request.code = app.OrgCode;
    request.name = app.name;
    request.shortname = app.shortname;
    request.par = app.sysparent;
    request.orgtype = "1";
    if (!!app.taxpayerid) {
      request.taxpayerid = app.taxpayerid;
    }
    if (!!app.taxpayername) {
      request.taxpayername = app.taxpayername;
    }
    if (!!app.principal) {
      request.principal = app.principal;
    }
    if (!!app.branchleader) {
      request.branchleader = app.branchleader;
    } else {
      request.branchleader = app.principal;
    }
    request.contact = app.contact;
    request.telephone = app.telephone;
    request.address = app.address;
    request._status = "Insert";
    let result2 = fun2.execute(request).res;
    if (result2.code === "999") {
      throw new Error("同步组织失败！\n" + JSON.stringify(result2));
    }
    //回写数据到自建组织
    var orgobject = { id: id, sysOrg: result2.data.id };
    var orgres = ObjectStore.updateById("GT34544AT7.GT34544AT7.GxsOrg", orgobject, "e1268035");
    //新增部门
    let deptInsert = extrequire("GT34544AT7.dept.deptInsert");
    request = { deptdefinefeature: { attrext25: 0 } };
    request.enable = 1;
    request.define3 = "0";
    request.code = app.OrgCode + "_P000";
    request.name = app.name + "默认部门";
    request.shortname = "默认部门";
    request.par = result2.data.id;
    request._status = "Insert";
    let result3 = deptInsert.execute(request).res;
    if (result3.code === "999") {
      throw new Error("同步默认部门失败！\n" + JSON.stringify(result3));
    }
    //回写部门
    var p000code = app.OrgCode + "_P000";
    // 查找gxsOrg的P000部门
    var P000org = { OrgCode: p000code };
    var result5 = ObjectStore.selectByMap("GT34544AT7.GT34544AT7.GxsOrg", P000org);
    let norg = result5[0];
    let nnorg = {
      id: norg.id,
      enable: 1,
      sysOrg: result3.id,
      sysOrgCode: request.code,
      sysparentorg: result2.data.id,
      sysparent: result2.data.id,
      sysparentcode: app.sysOrgCode,
      _status: "update"
    };
    if (!!app.principal) {
      nnorg.principal = app.principal;
    }
    if (!!app.branchleader) {
      nnorg.branchleader = app.branchleader;
    }
    let func7 = ObjectStore.updateById("GT34544AT7.GT34544AT7.GxsOrg", nnorg, "e1268035");
    //新增部门
    request = { deptdefinefeature: { attrext25: 1 } };
    request.enable = 1;
    request.define3 = "1";
    request.code = app.OrgCode + "OrgAdmin";
    request.name = app.name + "组织管理";
    request.shortname = "组织管理";
    request.par = result2.data.id;
    request._status = "Insert";
    result3 = deptInsert.execute(request).res;
    if (result3.code === "999") {
      throw new Error("同步组织管理失败！\n" + JSON.stringify(result3));
    }
    //回写部门
    var p000code = app.OrgCode + "OrgAdmin";
    // 查找gxsOrg的P000部门
    P000org = { OrgCode: p000code };
    result5 = ObjectStore.selectByMap("GT34544AT7.GT34544AT7.GxsOrg", P000org);
    norg = result5[0];
    nnorg = {
      id: norg.id,
      enable: 1,
      sysOrg: result3.id,
      sysOrgCode: request.code,
      sysparentorg: result2.data.id,
      sysparent: result2.data.id,
      sysparentcode: app.sysOrgCode,
      _status: "update"
    };
    if (!!app.principal) {
      nnorg.principal = app.principal;
    }
    if (!!app.branchleader) {
      nnorg.branchleader = app.branchleader;
    }
    func7 = ObjectStore.updateById("GT34544AT7.GT34544AT7.GxsOrg", nnorg, "e1268035");
    //新增部门
    request = { deptdefinefeature: { attrext25: 1 } };
    request.enable = 1;
    request.define3 = "1";
    request.code = app.OrgCode + "AreaAdmin";
    request.name = app.name + "管理区域";
    request.shortname = "管理区域";
    request.par = result2.data.id;
    request._status = "Insert";
    result3 = deptInsert.execute(request).res;
    if (result3.code === "999") {
      throw new Error("同步管理区域失败！\n" + JSON.stringify(result3));
    }
    //回写部门
    var p000code = app.OrgCode + "AreaAdmin";
    // 查找gxsOrg的P000部门
    P000org = { OrgCode: p000code };
    result5 = ObjectStore.selectByMap("GT34544AT7.GT34544AT7.GxsOrg", P000org);
    norg = result5[0];
    nnorg = {
      id: norg.id,
      enable: 1,
      sysOrg: result3.id,
      sysOrgCode: request.code,
      sysparentorg: result2.data.id,
      sysparent: result2.data.id,
      sysparentcode: app.sysOrgCode,
      _status: "update"
    };
    if (!!app.principal) {
      nnorg.principal = app.principal;
    }
    if (!!app.branchleader) {
      nnorg.branchleader = app.branchleader;
    }
    func7 = ObjectStore.updateById("GT34544AT7.GT34544AT7.GxsOrg", nnorg, "e1268035");
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });