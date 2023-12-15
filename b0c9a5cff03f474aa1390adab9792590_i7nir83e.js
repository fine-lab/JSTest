let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var data_length = param.data[0].xsxsb666List.length;
    var data_id = param.data[0].id;
    //更新
    var object1 = { id: data_id, rwzongshu: data_length };
    ObjectStore.updateById("AT186845D616E80006.AT186845D616E80006.xcxschs666", object1, "xcxschs666");
    return {};
  }
}
exports({ entryPoint: MyTrigger });