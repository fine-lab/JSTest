let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var id = param.data[0].id;
    var sql = "select * from AT161E5DFA09D00001.AT161E5DFA09D00001.productInformation where id='" + id + "'";
    var result = ObjectStore.queryByYonQL(sql, "developplatform");
    var ckSQL = "select * from AT161E5DFA09D00001.AT161E5DFA09D00001.IssueDetails where productCode = '" + id + "'";
    var ckResult = ObjectStore.queryByYonQL(ckSQL, "developplatform");
    var rkSQL = "select * from AT161E5DFA09D00001.AT161E5DFA09D00001.product_lis where product_code = '" + id + "'";
    var rkResult = ObjectStore.queryByYonQL(rkSQL, "developplatform");
    if (ckResult.length == 0) {
      // 说明该产品未被出库单引用，可以删除
    } else {
      throw new Error("该产品被出库单引用，不可删除！");
    }
    if (rkResult.length == 0) {
      // 说明该产品未被入库单引用，可以删除
    } else {
      throw new Error("该产品被入库单引用，不可删除！");
    }
    // 获取启用状态
    var enable = result[0].enable;
    // 获取委托方编码
    var clientCode = result[0].product_coding;
    if (enable == 1) {
      throw new Error("产品编码：'" + clientCode + "' ,为启用状态不可删除");
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });