let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var r = request.r;
    return { apidata: r.length }; //返回传入字符串的长度
  }
}
exports({ entryPoint: MyAPIHandler });