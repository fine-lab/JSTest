let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var object = { id: context };
    //实体查询
    var res = ObjectStore.selectById("AT15E7206608080004.AT15E7206608080004.customerinfo", object);
    return { res };
  }
}
exports({ entryPoint: MyTrigger });