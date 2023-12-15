let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var id = param.data[0].id;
    var sql = "select enable,BuyersCode from AT161E5DFA09D00001.AT161E5DFA09D00001.Buyers where id = '" + id + "'";
    var res = ObjectStore.queryByYonQL(sql);
    var ghSQL = "select * from AT161E5DFA09D00001.AT161E5DFA09D00001.IssueDocInfo where BuyerCode = '" + id + "'";
    var ghResult = ObjectStore.queryByYonQL(ghSQL, "developplatform");
    if (ghResult.length == 0) {
      // 说明该购货者未被出库单引用，可以删除
    } else {
      throw new Error("该购货者被出库单引用，不可删除！");
    }
    if (res.length > 0) {
      var enable = res[0].enable;
      var BuyersCode = res[0].BuyersCode;
      if (enable == "1") {
        throw new Error("购货者编码为：" + BuyersCode + "的单据已经是启用的单据不可删除！！！");
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });