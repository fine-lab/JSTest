let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //获取页面的邮箱信息
    var email = param.data[0].email;
    var res = validateEmail(email); //返回布尔值
    if (!res) {
      throw new Error("请输入正确邮箱!");
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });