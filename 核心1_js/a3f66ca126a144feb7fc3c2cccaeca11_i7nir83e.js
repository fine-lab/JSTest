let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var data_length = param.data[0].xsxx001List.length;
    var data_id = param.data[0].id;
    //更新
    var object1 = { id: data_id, zongshu: data_length };
    ObjectStore.updateById("AT1840871816E00004.AT1840871816E00004.xschs001", object1, "xschs001");
    return {};
  }
}
exports({ entryPoint: MyTrigger });