let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let app = JSON.parse(param.requestData);
    let agentOrgTypeOrgCode = app.sysparentcode;
    let typecodeorgbody = {
      code: agentOrgTypeOrgCode
    };
    let func11 = extrequire("GT34544AT7.org.searchOrgByCode");
    let res11 = func11.execute(typecodeorgbody).res;
    if (res11.data.length == 0) {
      throw new Error("未添加分类" + agentOrgTypeOrgCode);
    }
    let OrgTypeOrg = res11.data[0];
    var apporg = { OrgCode: app.OrgCode };
    let depttable = "GT1559AT25.GT1559AT25.AgentOrg";
    let billno = "6c5fefef";
    var gxsorgs = ObjectStore.selectByMap(depttable, apporg);
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
    request.par = OrgTypeOrg.id;
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
    app.OrgCode = result2.data.code;
    if (_status === "Insert") {
      var p000code = app.OrgCode + "_P000";
      // 查找gxsOrg的P000部门
      request.table = depttable;
      var P000org = { OrgCode: p000code };
      var result5 = ObjectStore.selectByMap(depttable, P000org);
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
        depttable,
        {
          id: app.id,
          sysOrg: app.sysOrg,
          OrgCode: app.OrgCode
        },
        billno
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
      if (result5.length > 0) {
        let norg = result5[0];
        norg.org_id = result2.data.id;
        norg.sysOrg = id1;
        norg.OrgCode = request.code;
        norg.sysparent = result2.data.id;
        norg.sysparentcode = app.OrgCode;
        norg.sysparentorg = result2.data.id;
        delete norg.pubts;
        // 更新gxsOrg的P000部门
        let func7 = ObjectStore.updateById(depttable, norg, billno);
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
      if (func6.length > 0) {
        let norg1 = func6[0];
        norg1.org_id = result2.data.id;
        norg1.sysOrg = id2;
        norg1.OrgCode = request.code;
        norg1.sysparent = result2.data.id;
        norg1.sysparentcode = result2.data.code;
        norg1.sysparentorg = result2.data.id;
        delete norg1.pubts;
        // 更新gxsOrg的OrgAdmin部门
        let result8 = ObjectStore.updateById(depttable, norg1, billno);
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });