let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    if (param.custMap.businessFlowId == "b6f67cd7-75dd-11ed-9896-6c92bf477043") {
      if (context.customMap.ref.data[0].shifuguidang) {
      } else {
        //未归档的情况下
        throw new Error("未归档不可以推付款");
      }
    } else if (param.custMap.businessFlowId == "167cc4e8-6eea-11ed-9896-6c92bf477043") {
      if (context.customMap.ref.data[0].shifuguidang) {
        throw new Error("不可重复下推归档");
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });