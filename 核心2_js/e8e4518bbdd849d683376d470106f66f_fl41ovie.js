let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var currentData = param.data[0];
    //获取当前保存的数据的id
    var id = currentData.id;
    var filterparams = currentData.StaffNew + "_" + currentData.matter_type_m;
    var object = { id: id, filterparams: filterparams };
    var res = ObjectStore.updateById("GT8053AT100.GT8053AT100.abnormalevent2", object);
    return {};
  }
}
exports({ entryPoint: MyTrigger });