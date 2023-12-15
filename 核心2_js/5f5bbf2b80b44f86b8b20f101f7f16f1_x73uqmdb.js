let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var object = {
      id: "youridHere"
    };
    //实体查询
    var res = ObjectStore.selectById("GT79146AT92.GT79146AT92.funcStore", object, "upu");
    return { res };
  }
}
exports({ entryPoint: MyTrigger });