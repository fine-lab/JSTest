let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let app = request.data;
    let fun3 = extrequire("GT34544AT7.dept.deptInsert");
    request.enable = app.enable;
    request.code = app.OrgCode;
    request.name = app.name;
    request.par = app.sysparentorg;
    request.principal = app.principal;
    request.branchleader = app.branchleader;
    request._status = "Update";
    if (!!app.shortname) {
      request.shortname = app.shortname;
    }
    if (!!app.item696yf) {
      request.innercode = app.item696yf;
    }
    if (!!app.sysOrg) {
      request.id = app.sysOrg;
    }
    let result3 = fun3.execute(request).res;
    if (result3.code === "999") {
      throw new Error("result3= " + app.id + request._status + " =" + JSON.stringify(result3.message));
    }
    let id1 = result3.data.id;
    // 查找gxsOrg部门
    request.table = "GT34544AT7.GT34544AT7.GxsOrg";
    request.conditions = {
      OrgCode: request.code
    };
    let func5 = extrequire("GT34544AT7.common.selectSqlByMapX");
    let result5 = func5.execute(request).res;
    let norg = result5[0];
    norg.id = app.id;
    norg.sysOrg = id1;
    norg.sysOrgCode = request.code;
    norg.sysparentorg = result3.data.parentorgid;
    norg.sysparent = result3.data.parentorgid;
    norg.sysparentcode = result3.data.parentorgCode;
    // 更新gxsOrg的P000部门
    request.object = norg;
    request.billNum = "082a9b6d";
    let func7 = extrequire("GT34544AT7.common.updatesql");
    let result7 = func7.execute(request);
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });