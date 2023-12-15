let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 查主实体
    var object = {};
    //实体查询
    var res = ObjectStore.queryByYonQL("select * from GT22176AT10.GT22176AT10.sy01_country_interface_data");
    console.log("---" + res);
    return { res };
  }
}
exports({
  entryPoint: MyAPIHandler
});