let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 用于获取公式传递的参数，多个参数的key，按照顺序使用 p1、p2、p3...进行接收
    let p1 = request.p1;
    return {
      formulaScriptRes: p1
    };
  }
}
exports({
  entryPoint: MyAPIHandler
});