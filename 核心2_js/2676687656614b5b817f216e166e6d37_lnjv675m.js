let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    function log(msg) {
      console.log(msg);
    }
    let app = param.data[0];
    let rd = JSON.parse(param.requestData);
    var mystatus = "";
    let request = {};
    let intdatares = {};
    if (rd._status == "Update") {
      request.table = "GT34544AT7.GT34544AT7.GxsOrg";
      request.conditions = {
        id: app.id
      };
      let intdata = extrequire("GT34544AT7.common.selectSqlByMapX");
      intdatares = intdata.execute(request).res[0];
    } else {
      mystatus = rd._status;
    }
    let fun3 = extrequire("GT34544AT7.dept.deptInsert");
    request.enable = app.enable;
    request.code = app.OrgCode;
    request.name = app.name;
    request.par = app.sysparentorg;
    request.parentorgid = app.sysManageOrg;
    request.define3 = "0";
    if (!!rd.principal) {
      request.principal = rd.principal;
    }
    if (!!rd.branchleader) {
      request.branchleader = rd.branchleader;
    }
    request._status = rd._status;
    if (!!app.shortname) {
      request.shortname = app.shortname;
    }
    if (!!app.innercode) {
      request.innercode = app.innercode;
    }
    if (!!app.sysOrg) {
      request.id = app.sysOrg;
    }
    if (!app.sysOrg && rd._status == "Update") {
      request.id = intdatares.sysOrg;
      request.code = intdatares.OrgCode;
      request.shortname = intdatares.shortname;
      request.name = intdatares.name;
    }
    request._status = !!intdatares.sysOrg ? "Update" : "Insert";
    let result3 = fun3.execute(request).res;
    if (result3.code === "999") {
      throw new Error("result3= " + app.id + request._status + " =" + JSON.stringify(result3.message));
    }
    let id1 = !!result3.data ? result3.data.id : result3.id;
    let accorg = !!result3.data ? result3.data : result3;
    log("accorg = ");
    log(accorg);
    log("app = ");
    log(app);
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
    norg.sysparentorg = accorg.parentorgid;
    norg.sysparent = accorg.parentorgid;
    norg.sysparentcode = accorg.parentorgCode;
    // 更新gxsOrg的P000部门
    request.object = norg;
    request.billNum = "082a9b6d";
    let func7 = extrequire("GT34544AT7.common.updatesql");
    let result7 = func7.execute(request);
    return { context, param };
  }
}
exports({ entryPoint: MyTrigger });