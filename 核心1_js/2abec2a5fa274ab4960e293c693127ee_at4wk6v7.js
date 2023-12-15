let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let param = request.p1;
    let ret = false;
    if (param == "123") {
      ret = true;
    }
    return {
      //返回字符串
      //返回布尔类型
      formulaScriptRes: ret
    };
  }
}
exports({ entryPoint: MyAPIHandler });