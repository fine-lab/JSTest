let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var id = param.data[0].id;
    var sql = "select * from GT5646AT1.GT5646AT1.sales_Report where id = '" + id + "'";
    var result = ObjectStore.queryByYonQL(sql, "developplatform");
    // 获取下推状态
    var pushState = result[0].pushDown;
    if (pushState == "true") {
      throw new Error("该数据已经下推销售出库，不可删除");
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });