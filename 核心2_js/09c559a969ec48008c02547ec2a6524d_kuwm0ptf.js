let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //查询某个条件的数据
    var yonql = "select sum(money) as money from GT79146AT92.GT79146AT92.funcStore where age = 1";
    var res = ObjectStore.queryByYonQL(yonql);
    let money = res[0].money;
    //更新另一个表中数据
    var updateWrapper = new Wrapper();
    updateWrapper.eq("name", "ssss");
    var toUpdate = { money: money };
    var res = ObjectStore.update("GT64965AT75.GT64965AT75.parentTable", toUpdate, updateWrapper, "0a2c44bf");
    return {};
  }
}
exports({ entryPoint: MyTrigger });