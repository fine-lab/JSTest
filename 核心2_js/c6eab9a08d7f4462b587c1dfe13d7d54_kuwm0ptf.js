let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var jsonData = JSON.stringify(context); // 转成JSON格式
    var jsonparam = JSON.stringify(param); // 转成JSON格式
    //可以弹出具体的信息（类似前端函数的alert）
    throw new Error("contextResult====>" + jsonData + "  param====> " + jsonparam);
    return {};
  }
}
exports({ entryPoint: MyTrigger });