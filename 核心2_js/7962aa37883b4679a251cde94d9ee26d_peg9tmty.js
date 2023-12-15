let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    // 购货者编码
    // 获取主表的出库状态
    var IssueType = param.data[0].IssueType;
    // 主表id
    var id = param.data[0].id;
    var DeliveryorderNo = param.data[0].DeliveryorderNo;
    // 查询出库单子表
    var sql = "select * from AT161E5DFA09D00001.AT161E5DFA09D00001.IssueDetails where IssueDocInfo_id='" + id + "'";
    var result = ObjectStore.queryByYonQL(sql, "developplatform");
    // 不用判断result长度，子表有必填项正常出库
    for (var i = 0; i < result.length; i++) {
      var sonDatails = result[i];
      // 获取有效期
      var termOfValidity = sonDatails.termOfValidity;
      var termTime = new Date(termOfValidity).getTime();
      var nowDate = new Date().getTime();
      // 如果当前日期在有效期内什么出库类型都可以保存
      var productName = sonDatails.productCode;
      if (nowDate > termTime) {
        if (IssueType == 1) {
          //不在有效期内
          throw new Error("出库单号:'" + DeliveryorderNo + "' 产品名称'" + productName + "'当前日期大于有效期请检查");
        } else if (IssueType == 2 || IssueType == 4) {
        } else {
          throw new Error("出库单号:'" + DeliveryorderNo + "' 产品名称'" + productName + "'当前日期大于有效期请检查");
        }
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });