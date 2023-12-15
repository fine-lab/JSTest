let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var id = param.data[0].id;
    var sql = "select * from AT161E5DFA09D00001.AT161E5DFA09D00001.IssueDocInfo where id='" + id + "'";
    var result = ObjectStore.queryByYonQL(sql, "developplatform");
    // 获取启用状态
    var enable = result[0].enable;
    // 获取出库单号
    var DeliveryorderNo = result[0].DeliveryorderNo;
    // 获取复核状态
    var checkStatus = result[0].ReviewStatus;
    if (enable == 1 || checkStatus == 1) {
      throw new Error("出库单号：'" + DeliveryorderNo + "' ,为已校验状态或启用状态不可删除");
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });