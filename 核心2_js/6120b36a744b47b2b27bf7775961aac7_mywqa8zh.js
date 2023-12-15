let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    // 获取当前选中行的物料id
    var id = param.data[0].id;
    // 查询自建物料子表
    var sql = "select product from GT9AT44.GT9AT44.son_product where product = " + id + "";
    var result = ObjectStore.queryByYonQL(sql, "developplatform");
    // 长度大于1说明被引用，不可删除
    if (result.length > 0) {
      throw new Error("--该物料被其他单据引用不允许删除--");
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });