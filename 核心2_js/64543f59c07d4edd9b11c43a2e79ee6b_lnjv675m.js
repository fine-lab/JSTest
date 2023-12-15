let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let ownDeptArr = request.data;
    for (let i = 0; i < ownDeptArr.length; i++) {
      let ownDept = ownDeptArr[i];
      if (!!ownDept.sysparentorg && !!ownDept.OrgCode && ownDept.isbizunit == "0" && ownDept.sysOrg == undefined) {
        let req = {};
        let body = {};
        let data = {};
        data.parent = ownDept.sysparentorg;
        data.code = ownDept.OrgCode;
        data.name = {
          zh_CN: ownDept.name
        };
        data.shortname = {
          zh_CN: ownDept.shortname
        };
        data.parentorgid = ownDept.sysparentorg;
        data.orgtype = 2;
        data.enable = 1;
        data._status = "Insert";
        data["deptdefines!define3"] = ownDept.ishide;
        let func1 = extrequire("GT34544AT7.common.baseOpenApi");
        body.data = data;
        req.body = body;
        req.uri = "/yonbip/digitalModel/admindept/save";
        let res = func1.execute(req).res;
        if (res.code == "999") {
          throw new Error("新增默认部门失败！\n" + JSON.stringify(res));
        }
        //回写
        let obj = {
          id: ownDept.id,
          sysOrg: res.data.id
        };
        res = ObjectStore.updateById("GT34544AT7.GT34544AT7.GxsOrg", obj, "e1268035");
      }
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });