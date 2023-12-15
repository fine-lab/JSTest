let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //查询数据库数据 org.func.TaxpayerOrg
    var querysql = "select a.*,(select b.* from taxcloud_properties_TaxpayerOrgList b) from GT63716AT28.GT63716AT28.taxcloud_properties a where dr = 0 limit 1";
    //返回第一条数据
    var result = ObjectStore.queryByYonQL(querysql, "developplatform")[0];
    var object = {};
    return { result };
  }
}
exports({ entryPoint: MyAPIHandler });