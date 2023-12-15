let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var object = { id: "youridHere", jiekuanzhuangtai: "已结清111" };
    var res = ObjectStore.updateById("GT18647AT1.GT18647AT1.gysfkd", object, "ce3c614e"); //用id对当前单据进行更新
    return { res };
  }
}
exports({ entryPoint: MyTrigger });