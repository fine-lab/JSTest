let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    // 获取效期控制组件和有效期至组件的值
    let { effectiveControl, validUntil } = param.data[0];
    // 判断效期控制为是时，有效期至是否为空
    if (effectiveControl) {
      if (typeof validUntil == "undefined" || validUntil === null) {
        // 若为空，则弹框提示：当效期控制为是时，有效期至必填
        throw new Error("当效期控制为是时，有效期至必填");
      }
    } else {
      return {};
    }
  }
}
exports({ entryPoint: MyTrigger });