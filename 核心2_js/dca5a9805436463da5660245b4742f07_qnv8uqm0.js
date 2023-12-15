let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    return {};
    var entity = "04cd7855List"; //
    var yemianid = "youridHere";
    var object1 = {
      id: param.data[0].id
    };
    var res1 = ObjectStore.selectById(entity, object1);
    var object = { id: res1.id, pubts: res1.pubts };
    var res = ObjectStore.deleteById(entity, object, yemianid);
  }
}
exports({ entryPoint: MyTrigger });