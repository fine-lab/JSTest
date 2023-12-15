let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //通过上下文获取当前的用户信息
    var currentUser = JSON.parse(AppContext()).currentUser;
    var tenantId = currentUser.tenantId;
    var _status = request._status === undefined || request._status === null ? "Insert" : request._status;
    var body = {
      data: {
        code: request.code,
        name: {
          zh_CN: request.name
        },
        shortname: {
          zh_CN: request.shortname === undefined || request.shortname === null ? request.name : request.shortname
        },
        enable: request.enable === undefined || request.enable === null ? "1" : request.enable === "1" || request.enable === 1 || request.enable === true || request.enable === "true" ? "1" : "0",
        orgtype: 1,
        exchangerate: tenantId,
        exchangerate_name: "基准汇率",
        _status: _status
      }
    };
    if (!!request.taxpayername) {
      body.data.taxpayername = request.taxpayername;
    }
    if (!!request.taxpayerid) {
      body.data.taxpayerid = request.taxpayerid;
    }
    if (!!request.principal) {
      body.data.principal = request.principal;
    }
    if (!!request.branchleader) {
      body.data.branchleader = request.branchleader;
    }
    if (!!request.contact) {
      body.data.contact = request.contact;
    }
    if (!!request.telephone) {
      body.data.telephone = request.telephone;
    }
    if (!!request.address) {
      body.data.address = { zh_CN: request.address };
    }
    if (request._status !== undefined && request._status !== null) {
      if (!!request.id && request._status === "Update") {
        body.data["id"] = request.id;
        if (!!request.enableAdminOrg) {
          body.data.adminOrg = { enable: "" + request.enableAdminOrg, id: request.id };
          body.externalData = { typelist: ["adminorg"] };
        }
      } else if (request._status === "Insert" && !!request.enableAdminOrg) {
        body.data.adminOrg = { enable: "" + request.enableAdminOrg };
        body.externalData = { typelist: ["adminorg"] };
      }
    }
    if (request.par !== undefined && request.par !== null) {
      body.data.parent = request.par;
      if (!!request.enableAdminOrg) {
        body.data.adminOrg.parentid = request.par;
        body.data.adminOrg.parentorgid = request.par;
      }
    }
    let func1 = extrequire("GT34544AT7.common.baseOpenApi");
    request.body = body;
    request.uri = "/yonbip/digitalModel/orgunit/save";
    let res1 = func1.execute(request);
    var res = res1.res;
    if (res.code == "999" && _status == "Update") {
      throw new Error("组织没有职能部门更新失败 => " + res.message);
    }
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });