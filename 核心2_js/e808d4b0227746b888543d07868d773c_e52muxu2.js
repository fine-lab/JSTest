let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //查询内容
    var object = { id: "youridHere" };
    var res = ObjectStore.selectById("GT52776AT5.GT52776AT5.simpletest", object);
    return { res };
  }
}
exports({ entryPoint: MyTrigger });