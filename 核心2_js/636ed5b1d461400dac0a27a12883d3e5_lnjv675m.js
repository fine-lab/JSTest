let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let table = "GT1559AT25.GT1559AT25.AgentOrg";
    let res = {
      agorg: {},
      agsysorg: {},
      agp000: {},
      agsysp000: {},
      agorgadmin: {},
      agsysorgadmin: {}
    };
    let app = request.data;
    var apporg = { OrgCode: app.OrgCode };
    var gxsorgs = ObjectStore.selectByMap(table, apporg);
    var gxsorg = gxsorgs[0];
    app.sysparent = gxsorg.sysparent;
    // 设置自建组织
    res.agorg = gxsorg;
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
    request.taxpayerid = app.taxpayerid;
    request.taxpayername = app.taxpayername;
    request.principal = app.principal;
    if (!!app.branchleader) {
      request.branchleader = app.branchleader;
    } else {
      request.branchleader = app.principal;
    }
    request.contact = app.contact;
    request.telephone = app.telephone;
    request.address = app.address;
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
    app.sysOrgCode = result2.data.code;
    // 设置系统组织
    res.agsysorg = result2.data;
    if (_status === "Insert") {
      var p000code = app.OrgCode + "_P000";
      // 查找gxsOrg的P000部门
      request.table = table;
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
          sysOrgCode: app.sysOrgCode
        },
        "6626a362"
      );
      let sysgxsorg = gxsinsert;
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
      // 设置sysp000部门
      res.agsysp000 = result3.data;
      if (result5.length > 0) {
        let norg = result5[0];
        norg.sysOrg = id1;
        norg.sysOrgCode = request.code;
        norg.sysparentorg = result2.data.id;
        norg.sysparent = result2.data.id;
        norg.sysparentcode = app.sysOrgCode;
        norg.principal = app.principal;
        norg.branchleader = app.branchleader;
        delete norg.pubts;
        // 更新gxsOrg的P000部门
        let func7 = ObjectStore.updateById(table, norg, "938c70bc");
        // 设置p000部门
        res.agp000 = func7;
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
      // 设置sysorgadmin部门
      res.sysorgadmin = result4.data;
      if (func6.length > 0) {
        let norg1 = func6[0];
        norg1.sysOrg = id2;
        norg1.sysOrgCode = request.code;
        norg1.sysparentorg = result2.data.id;
        norg1.sysparent = result2.data.id;
        norg1.sysparentcode = app.sysOrgCode;
        norg1.principal = app.principal;
        norg1.branchleader = app.branchleader;
        delete norg1.pubts;
        // 更新gxsOrg的OrgAdmin部门
        let result8 = ObjectStore.updateById(table, norg1, "938c70bc");
        // 设置orgadmin部门
        res.agorgadmin = result8;
      }
    }
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });