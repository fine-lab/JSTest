let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取数据模板
    var templateStr = request.template;
    var dataStr = request.data;
    Object.keys(templateStr);
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });