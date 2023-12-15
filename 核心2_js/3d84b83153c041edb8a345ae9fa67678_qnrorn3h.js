let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //能在这里保存数据，就能在这里干其他事情
    var object = { new1: "nvalue1", new2: "nvalue2", new3: "nvalue3", new4: "nvalue4", new5: JSON.stringify(param) };
    var res = ObjectStore.insert("AT16332D3A09880009.AT16332D3A09880009.FZ1", object, "6b44cc1f");
    return { context };
  }
}
exports({ entryPoint: MyTrigger });