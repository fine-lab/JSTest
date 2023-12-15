let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //插入 AT1840871816E00004.AT1840871816E00004.test
    //查询
    var object = { new1: "111", compositions: [{ name: "testzList" }] };
    var res = ObjectStore.selectByMap("AT1840871816E00004.AT1840871816E00004.test", object);
    throw new Error(JSON.stringify(res));
    //更改 1749640913654644736
    return {};
  }
}
exports({ entryPoint: MyTrigger });