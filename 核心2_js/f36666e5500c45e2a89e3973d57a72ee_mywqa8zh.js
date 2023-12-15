let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    // 获取物料的id--> 1547166877962207233
    var id = param.data[0].id;
    // 查询自建物料子表
    var sql = "select product from GT9AT44.GT9AT44.son_product where product = " + id + "";
    var result = ObjectStore.queryByYonQL(sql, "developplatform");
    if (result.length > 0) {
      //说明该物料被引用不允许删除
      throw new Error("该物料被其他单据引用无法删除");
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });