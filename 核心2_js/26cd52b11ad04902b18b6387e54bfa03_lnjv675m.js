let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //修改系统编码--单击
    let res = ObjectStore.queryByYonQL(
      "select id,sysOrg,OrgCode from GT34544AT7.GT34544AT7.GxsOrg where ishide is not null and isbizunit =0 and sysparentorgcode != 'H510000000000_X035' and sysparentorgcode != 'H510000000000_X031'  and dr = 0"
    );
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });