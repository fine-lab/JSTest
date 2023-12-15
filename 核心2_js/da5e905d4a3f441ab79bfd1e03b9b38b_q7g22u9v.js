let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    // 获取效期控制(新)组件和有效期至(新)组件的值
    let { newValidityControl, newDueDate } = param.data[0];
    // 判断效期控制(新)为是时，有效期至(新)是否为空
    if (newValidityControl && newDueDate === null) {
      // 若为空，则弹框提示：当效期控制(新)为是时，有效期至(新)必填
      throw new Error("当效期控制(新)为是时，有效期至(新)必填");
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });