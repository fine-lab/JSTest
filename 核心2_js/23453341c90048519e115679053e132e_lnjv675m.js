let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let app = JSON.parse(param.requestData);
    let returnApp = param.return;
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
    let billno = "938c70bc";
    let deptbillno = "2320fbd0";
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
    request.enableAdminOrg = 1;
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
    // 查询并新增一个
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
    let obj1 = {
      id: returnApp.id,
      sysOrg: app.sysOrg,
      OrgCode: app.OrgCode
    };
    let gxsinsert = ObjectStore.updateById(depttable, obj1, billno);
    return {};
  }
}
exports({ entryPoint: MyTrigger });