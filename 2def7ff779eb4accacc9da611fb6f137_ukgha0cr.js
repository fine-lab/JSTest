let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //校验：返回两个key， validityCode 合法性（1-合法，2-不合法），message 字符串提示信息（即不合法时的原因）
    let sources = request.sources; //条件数组
    let target = [];
    target.push(request.target); //结果数组
    let validityCode = 0;
    let message = "";
    return { validityCode, message };
  }
}
exports({ entryPoint: MyAPIHandler });