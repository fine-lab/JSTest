let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    function log(msg) {
      let method = "GT53685AT3.dept.registerGxyDept";
      let { bizFlowId, bizFlowInstanceId } = param.return;
      let queen = "";
      if (!!bizFlowId && !!bizFlowInstanceId) {
        queen += bizFlowId;
      } else {
        queen += "hellword";
      }
      let msg1 = "";
      let type = typeof msg;
      if (type == "string") {
        msg1 = msg;
      } else {
        msg1 = JSON.stringify(msg);
      }
      let nmsg = "\n" + method + "\n" + msg1;
      let logfunc = extrequire("GT9912AT31.common.logQueen");
      if (!!bizFlowInstanceId) {
        nmsg = "\n" + bizFlowInstanceId + ":\n" + nmsg;
      }
      logfunc.execute({ queen, msg: nmsg });
    }
    var user = JSON.parse(AppContext());
    log("用户" + user.currentUser.id + "=>" + user.currentUser.name + "修改");
    log(param.requestData);
    let app = param.return;
    log("\napp=\n" + JSON.stringify(app) + "\n");
    let rd = JSON.parse(param.requestData);
    let { DeptCode } = app;
    let ndept = {};
    let url = "https://www.example.com/";
    let body3 = {
      data: {
        code: [DeptCode]
      }
    };
    let apiResponse3 = openLinker("POST", url, "GT53685AT3", JSON.stringify(body3));
    let r3 = JSON.parse(apiResponse3);
    var mystatus = "";
    if (r3.data.length > 0) {
      ndept = r3.data[0];
      log("找到这个部门\n" + JSON.stringify(ndept));
    }
    if (Object.keys(ndept).length > 0) {
      mystatus = "Update";
    } else {
      mystatus = "Insert";
    }
    let request = {};
    let intdatares = {};
    request.table = "GT53685AT3.GT53685AT3.GxyDept";
    request.conditions = {
      id: app.id
    };
    let intdata = extrequire("GT34544AT7.common.selectSqlByMapX");
    intdatares = intdata.execute(request).res[0];
    let fun3 = extrequire("GT34544AT7.dept.deptInsert");
    request.define3 = "0";
    request.enable = app.enable;
    request.code = app.DeptCode;
    request.name = app.name;
    request.par = app.org_id;
    request.parentorgid = app.org_id;
    if (!!app.sysparent) {
      request.par = app.sysparent;
    }
    if (!!rd.principal) {
      request.principal = rd.principal;
    }
    if (!!rd.branchleader) {
      request.branchleader = rd.branchleader;
    }
    if (!!app.shortname) {
      request.shortname = app.shortname;
    }
    if (!!app.innercode) {
      request.innercode = app.innercode;
    }
    if (!!app.sysDept) {
      request.id = app.sysDept;
    }
    if (!app.sysDept) {
      if (mystatus == "Update") {
        request.id = ndept.id;
      }
    }
    request._status = mystatus;
    let result3 = fun3.execute(request).res;
    if (result3.code === "999") {
      throw new Error("result3= " + app.id + request._status + " =" + JSON.stringify(result3.message));
    }
    let accorg = !!result3.data ? result3.data : result3;
    let id1 = accorg.id;
    // 查找gxyDept部门
    request.table = "GT53685AT3.GT53685AT3.GxyDept";
    request.conditions = {
      DeptCode: request.code
    };
    let func5 = extrequire("GT34544AT7.common.selectSqlByMapX");
    let result5 = func5.execute(request).res;
    let norg = result5[0];
    norg.id = app.id;
    norg.sysDept = id1;
    norg.DeptCode = accorg.code;
    norg.sysparent = accorg.parentid;
    norg.sysparentcode = accorg.parentorgCode;
    // 更新gxsOrg的P000部门
    request.object = norg;
    request.billNum = "yb191f6c19_All";
    let func7 = extrequire("GT34544AT7.common.updatesql");
    let result7 = func7.execute(request);
    return { context, param };
  }
}
exports({ entryPoint: MyTrigger });