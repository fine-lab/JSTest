let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let v = request.r;
    let r = v + ":" + S4(); //一个简单的算法，根据参数形成新的字符串，格式为参数:四位随机字符返回
    return { r: r };
  }
}
exports({ entryPoint: MyAPIHandler });