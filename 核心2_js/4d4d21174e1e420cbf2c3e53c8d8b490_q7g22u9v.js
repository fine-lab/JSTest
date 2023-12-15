let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    // 获取效期控制组件和有效期至组件的值
    let { boole, date } = param.data[0];
    // 判断效期控制为是时，有效期至是否为空
    if (boole && date === null) {
      // 若为空，则弹框提示：当效期控制为是是，有效期至必填
      throw new Error("当效期控制为是时，有效期至必填");
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });