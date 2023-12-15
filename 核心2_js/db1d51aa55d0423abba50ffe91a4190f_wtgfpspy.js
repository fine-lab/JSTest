let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //拿到数据
    var data = param.data[0];
    var object_YJ = { id: "youridHere", IsStandard: "2" };
    var res = ObjectStore.updateById("GT9154AT5.GT9154AT5.QuoteBill_cl", object_YJ);
    return { res };
  }
}
exports({ entryPoint: MyTrigger });