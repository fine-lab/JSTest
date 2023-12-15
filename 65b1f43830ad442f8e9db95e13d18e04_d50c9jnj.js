let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let id = param.data[0].id; // 主表id
    let suppliershippingschedulebList = param.data[0].suppliershippingschedulebList;
    return {};
  }
}
exports({ entryPoint: MyTrigger });