let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //实体查询
    var res = ObjectStore.queryByYonQL("select * from GT22176AT10.GT22176AT10.sy01_country_interface_data where dr = 0");
    return { res };
  }
}
exports({
  entryPoint: MyAPIHandler
});