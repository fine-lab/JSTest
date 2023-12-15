let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //这里能写一行单独的数据保存就能干其他事情
    var object = { new1: "value1", new2: "value2", new3: "value3", new4: "value4" };
    var res = ObjectStore.insert("GT6248AT13.GT6248AT13.FZ1SH1", object, "50565622");
    return {};
  }
}
exports({ entryPoint: MyTrigger });