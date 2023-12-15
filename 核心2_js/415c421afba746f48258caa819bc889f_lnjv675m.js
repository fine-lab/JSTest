let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //修改系统组织“内部码”
    var res = ObjectStore.queryByYonQL(
      "select OrgCode,sysparentcode from GT34544AT7.GT34544AT7.GxsOrg where dr = 0 and level = 7 and isbizunit = 1 and sysOrg is not null and OrgCode is not null and sysparentcode is not null"
    );
    //修改自建组织“是否有管理员”字段
    //将管理组织的 是否有组织管理员 改为否
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });