let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //查询内容
    var object1 = { id: "youridHere", shuzhi: 25 };
    var res1 = ObjectStore.updateById("GT84264AT189.GT84264AT189.simple2022032103", object1, "3011f2e9");
    return { res1 };
  }
}
exports({ entryPoint: MyTrigger });