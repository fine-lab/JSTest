let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 值范围：返回一个key，range 取值范围数组
    let sources = request.sources; //条件数组
    let target = [];
    target.push(request.target); //结果数组
    let range = [];
    return { range };
  }
}
exports({ entryPoint: MyAPIHandler });