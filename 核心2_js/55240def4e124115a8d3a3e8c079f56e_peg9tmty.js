let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var id = param.data[0].id;
    var sql = "select * from AT161E5DFA09D00001.AT161E5DFA09D00001.ClientInformation where id='" + id + "'";
    var result = ObjectStore.queryByYonQL(sql, "developplatform");
    var ckSQL = "select * from AT161E5DFA09D00001.AT161E5DFA09D00001.IssueDocInfo where ClientCode = '" + id + "'";
    var ckResult = ObjectStore.queryByYonQL(ckSQL, "developplatform");
    if (ckResult.length == 0) {
      // 说明该委托方未被出库单引用，可以删除
    } else {
      throw new Error("该委托方被出库单引用，不可删除！");
    }
    // 获取启用状态
    var enable = result[0].enable;
    // 获取委托方编码
    var clientCode = result[0].clientCode;
    if (enable == 1) {
      throw new Error("委托方企业编码：'" + clientCode + "' ,为启用状态不可删除");
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });