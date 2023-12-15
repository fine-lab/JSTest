let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    // 扩展代码 start
    var pdata = param.data[0];
    if (pdata != null && pdata.defines != null) {
      var define1 = pdata.defines.define1;
      var define2 = pdata.defines.define2;
      if (define2 == "true" && (define1 == null || define1 == "")) {
        throw new Error("是否特殊客户 选择 是 时，特殊客户说明 不能为空！");
      }
    }
    // 扩展代码 end
    return {};
  }
}
exports({ entryPoint: MyTrigger });