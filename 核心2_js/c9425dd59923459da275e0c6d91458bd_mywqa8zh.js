let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //更新内容
    var object = { id: "youridHere", TaskorderdetailsList: [{ id: "youridHere", Productionworknumber: "test", _status: "Update" }] };
    //更新实体
    var res = ObjectStore.updateById("GT102159AT2.GT102159AT2.Taskorder", object, "b00c5821");
    return {};
  }
}
exports({ entryPoint: MyTrigger });