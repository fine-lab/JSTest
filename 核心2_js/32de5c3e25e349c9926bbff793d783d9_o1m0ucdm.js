let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //同时更
    var object = {
      id: param.data[0].id,
      shifuguidang: false
    };
    var res = ObjectStore.updateById("GT879AT352.GT879AT352.htxqc", object, "7b78e263");
    return { res };
  }
}
exports({ entryPoint: MyTrigger });