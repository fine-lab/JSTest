let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //修改系统部门“内部码”
    var res = ObjectStore.queryByYonQL(
      'select sysOrg,OrgCode,sysparentcode from GT34544AT7.GT34544AT7.GxsOrg where dr = 0 and level = 8 and isbizunit = 0 and sysOrg is not null and OrgCode is not null and sysparentcode is not null and OrgCode like "H511781000000_X001_P000"'
    );
    //维护自建组织的 path
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });