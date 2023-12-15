let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let id = param.data[0].id;
    let sql = "select * from GT5646AT1.GT5646AT1.sales_Report where id='" + id + "'";
    let res = ObjectStore.queryByYonQL(sql, "developplatform");
    //获取下推状态
    var pushState = res[0].pushDown;
    if (pushState == "true") {
      throw new Error("该数据已经保存销售出库不可删除");
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });