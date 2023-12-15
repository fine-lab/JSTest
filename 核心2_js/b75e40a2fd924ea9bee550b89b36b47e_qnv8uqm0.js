let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var entity = "GT70756AT9.GT70756AT9.DZD_ZB"; //
    var yemianid = "youridHere";
    var object1 = {
      id: param.data[0].id
    };
    var res1 = ObjectStore.selectById(entity, object1);
    var object = { id: res1.id, pubts: res1.pubts };
    var res = ObjectStore.deleteById(entity, object, yemianid);
    return {};
    return {};
  }
}
exports({ entryPoint: MyTrigger });