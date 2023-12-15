let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //查询内容
    var object = [{ id: "youridHere" }];
    var res = ObjectStore.deleteBatch("AT18C78C8C17C00002.AT18C78C8C17C00002.test0803b1", object, "test0803b1");
    return { res };
  }
}
exports({ entryPoint: MyTrigger });