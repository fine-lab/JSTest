let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取文件
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });