let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 赋值：返回一个key，assign 结果值
    let sources = request.sources; //条件数组
    let target = [];
    target.push(request.target); //结果数组
    let assign = "";
    return { assign };
  }
}
exports({ entryPoint: MyAPIHandler });