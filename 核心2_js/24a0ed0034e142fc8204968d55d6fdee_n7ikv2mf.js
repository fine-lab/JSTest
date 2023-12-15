let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //变更中
    var object = { id: param.data[0].source_id, changeStatus: "2" };
    var res = ObjectStore.updateById("GT27606AT15.GT27606AT15.HBZXM", object);
  }
}
exports({ entryPoint: MyTrigger });