let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let re = param.return;
    let rq = param.requestData;
    if (re.item254td === "0") {
      let sysorg = {
        define2: re.lLJnumberType,
        parentorgid: re.sysparent,
        parent: re.sysparent,
        parent_code: re.sysparentcode,
        code: re.OrgCode,
        name: {
          zh_CN: re.name
        },
        parent_name: re.sysparent_name,
        _status: "Insert",
        enable: 1
      };
      if (re.principal !== undefined) {
        sysorg.principal = re.principal;
      }
      if (re.item590vh !== undefined) {
        sysorg.branchleader = re.item590vh;
      }
      let func2 = extrequire("GT34544AT7.common.baseOpenApi");
      let request = {};
      request.body = { data: sysorg };
      request.uri = "/yonbip/digitalModel/admindept/save";
      let res2 = func2.execute(request);
      //保存成功，将系统id同步到自建组织 res2.res.data
      var object = { id: re.id, sysOrg: res2.res.data.id };
      var res = ObjectStore.updateById("GT34544AT7.GT34544AT7.GxsOrg", object, "0c60daaf");
    } else if (re.item254td === "1") {
      let sysorg = {
        "deptdefines!define2": re.lLJnumberType,
        id: re.sysOrg_id,
        parentorgid: re.sysparent,
        parent: re.sysparent,
        parent_code: re.sysparentcode,
        code: re.OrgCode,
        name: {
          zh_CN: re.name
        },
        parent_name: re.parent_name,
        _status: "Update",
        enable: 1
      };
      if (re.principal !== undefined) {
        sysorg.principal = re.principal;
      }
      if (re.item590vh !== undefined) {
        sysorg.branchleader = re.item590vh;
      }
      let func2 = extrequire("GT34544AT7.common.baseOpenApi");
      let request;
      request = { bady: {} };
      request.body = { data: sysorg };
      request.uri = "/yonbip/digitalModel/admindept/save";
      let res2 = func2.execute(request);
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });