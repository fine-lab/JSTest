let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let app = request.data;
    let table = "GT1559AT25.GT1559AT25.GxyCustomer";
    let depttable = "GT1559AT25.GT1559AT25.GxyCustomerDept";
    let res = {
      gcorg: {},
      gcsysorg: {},
      gcp000: {},
      gcsysp000: {},
      gcorgadmin: {},
      gcsysorgadmin: {}
    };
    let billNo = "aeccaf1a";
    var apporg = { OrgCode: app.OrgCode };
    var gxsorgs = ObjectStore.selectByMap(table, apporg);
    var gxsorg = gxsorgs[0];
    app.sysparent = gxsorg.sysparent;
    let status = !!gxsorg.sysOrg ? 1 : 0;
    let _status = null;
    if (status == 0) {
      _status = "Insert";
    } else if (status == 1) {
      _status = "Update";
    }
    let request = {};
    let fun2 = extrequire("GT1559AT25.org.orgInsert");
    request.enable = 1;
    request.code = app.OrgCode;
    request.name = app.name;
    request.shortname = app.shortname;
    request.par = app.sysparent;
    request.orgtype = "1";
    request._status = _status;
    if (_status === "Update") {
      request.id = app.sysOrg;
    }
    let result2 = fun2.execute(request).res;
    if (result2.code === "999") {
      let body11 = {
        code: app.OrgCode
      };
      let func11 = extrequire("GT34544AT7.org.searchOrgByCode");
      let res11 = func11.execute(body11);
      result2.data = res11.res.data[0];
    }
    app.sysOrg = result2.data.id;
    app.OrgCode = result2.data.code;
    // 设置系统gc组织
    res.gcsysorg = result2.data;
    if (_status === "Insert") {
      var p000code = app.OrgCode + "_P000";
      // 查找gxsOrg的P000部门
      request.table = depttable;
      var P000org = { OrgCode: p000code };
      var result5 = ObjectStore.selectByMap(request.table, P000org);
      if (result5.length == 0) {
        throw new Error("请等待推单流程完成再重新同步");
      }
      var orgAdmincode = app.OrgCode + "OrgAdmin";
      var OrgAdminorg = {
        OrgCode: orgAdmincode
      };
      let func6 = ObjectStore.selectByMap(request.table, OrgAdminorg);
      if (func6.length == 0) {
        throw new Error("请等待推单流程完成再重新同步");
      }
      let gxsinsert = ObjectStore.updateById(
        table,
        {
          id: app.id,
          sysOrg: app.sysOrg,
          OrgCode: app.OrgCode
        },
        "6626a362"
      );
      let sysgxsorg = gxsinsert;
      // 设置自建gc组织
      res.gcorg = gxsinsert;
      // 新增sysOrg的P000部门（dept）
      let fun3 = extrequire("GT34544AT7.dept.deptInsert");
      request.code = app.OrgCode + "_P000";
      request.name = app.name + "默认部门";
      request.shortname = app.shortname;
      request.par = result2.data.id;
      request._status = _status;
      let result3 = fun3.execute(request).res;
      if (result3.code === "999") {
        let url = "https://www.example.com/";
        let body = {
          data: {
            code: [request.code]
          }
        };
        let apiResponse = openLinker("POST", url, "GT53685AT3", JSON.stringify(body));
        let r3 = JSON.parse(apiResponse);
        result3.data = r3.data[0];
      }
      let id1 = result3.data.id;
      // 设置系统gc默认部门
      res.gcsysp000 = result3.data;
      if (result5.length > 0) {
        let norg = result5[0];
        norg.sysDept = id1;
        norg.DeptCode = request.code;
        norg.sysparent = result2.data.id;
        norg.sysparentcode = app.OrgCode;
        delete norg.pubts;
        // 更新gxsOrg的P000部门
        let func7 = ObjectStore.updateById(depttable, norg, billNo);
        // 设置自建gc默认部门
        res.gcp000 = func7;
      }
      // 新增sysOrg的OrgAdmin部门（dept）
      let fun4 = extrequire("GT34544AT7.dept.deptInsert");
      request.code = app.OrgCode + "OrgAdmin";
      request.name = app.name + "管理部门";
      request.shortname = app.shortname;
      request.par = result2.data.id;
      request._status = _status;
      let result4 = fun4.execute(request).res;
      if (result4.code === "999") {
        let url = "https://www.example.com/";
        let body = {
          data: {
            code: [request.code]
          }
        };
        let apiResponse = openLinker("POST", url, "GT53685AT3", JSON.stringify(body));
        let r4 = JSON.parse(apiResponse);
        result4.data = r4.data[0];
      }
      let id2 = result4.data.id;
      // 设置系统gc管理部门
      res.gcsysorgadmin = result4.data;
      if (func6.length > 0) {
        let norg1 = func6[0];
        norg1.sysDept = id2;
        norg1.DeptCode = request.code;
        norg1.sysparent = result2.data.id;
        norg1.sysparentcode = result2.data.code;
        delete norg1.pubts;
        // 更新gxsOrg的OrgAdmin部门
        let result8 = ObjectStore.updateById(depttable, norg1, billNo);
        // 设置自建gc管理部门
        res.gcorgadmin = result8;
      }
    }
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });