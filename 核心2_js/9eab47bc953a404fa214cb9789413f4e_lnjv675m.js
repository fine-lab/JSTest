let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let res = {};
    let table = "GT35175AT8.GT35175AT8.HyFund_MTB";
    //存入数据库的切块子表实体
    let obj = param.return;
    //切块子表的上级资金主表id
    let HyFund_cutFk = obj.HyFund_cutFk;
    let conditions = { id: HyFund_cutFk };
    let object = ObjectStore.selectByMap(table, conditions);
    object[0].adjust_state = "0";
    res = ObjectStore.updateById(table, object[0]);
    return { res };
  }
}
exports({ entryPoint: MyTrigger });