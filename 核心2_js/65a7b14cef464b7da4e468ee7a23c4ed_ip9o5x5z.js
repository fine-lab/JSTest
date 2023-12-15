let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var data = param.data[0];
    var base_path = "http://116.63.164.48:9081/servlet/customerDelServlet"; //第三方接口路径
    let header = { "Content-type": "application/x-www-form-urlencoded" };
    var body = {
      code: data.code
    };
    //调用api函数
    return {};
  }
}
exports({ entryPoint: MyTrigger });