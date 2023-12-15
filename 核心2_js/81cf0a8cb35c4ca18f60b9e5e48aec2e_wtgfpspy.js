let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var data = param.data[0];
    //向报价单中添加“是否标准”的数值，进行非标报价判断
    var object_YJ = { id: "youridHere", IsStandard: "0" };
    var res = ObjectStore.updateById("GT9154AT5.GT9154AT5.QuoteBill_cl", object_YJ);
    return {};
  }
}
exports({ entryPoint: MyTrigger });