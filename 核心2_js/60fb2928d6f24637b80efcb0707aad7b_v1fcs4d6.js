let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //项目主键
    var orgId = request.orgId;
    //单据id
    var idnumber = request.idnumber;
    var sql = "select id from GT83441AT1.GT83441AT1.setWarehouse where dr=0 and org_id='" + orgId + "'";
    var res = ObjectStore.queryByYonQL(sql, "developplatform");
    if (idnumber === undefined && res.length > 0) {
      throw new Error("保存失败，所选组织已存在仓库设置数据！");
    } else if (idnumber !== undefined && idnumber != res[0].id) {
      throw new Error("保存失败，所选组织已存在仓库设置数据！");
    }
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });