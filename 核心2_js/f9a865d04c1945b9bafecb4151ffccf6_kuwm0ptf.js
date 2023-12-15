let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //获取页面的邮件信息
    var email = param.data[0].email;
    var res = validateEmail(email);
    if (!res) {
      throw new Error("请输入正确的邮箱！");
    } else {
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });