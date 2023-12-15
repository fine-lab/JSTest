let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var id = param.data[0].id;
    var sql = "select * from AT161E5DFA09D00001.AT161E5DFA09D00001.IssueDocInfo where id='" + id + "'";
    var result = ObjectStore.queryByYonQL(sql, "developplatform");
    // 获取启用状态
    var enable = result[0].enable;
    // 获取委托方编码
    var DeliveryorderNo = result[0].DeliveryorderNo;
    if (enable == 1) {
      throw new Error("出库单号：'" + DeliveryorderNo + "' ,为启用状态不可删除");
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });