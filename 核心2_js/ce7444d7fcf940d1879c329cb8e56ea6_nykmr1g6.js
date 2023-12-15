//首营品种审批--->商品，更新相关字段。
let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    return {};
  }
}
exports({
  entryPoint: MyTrigger
});