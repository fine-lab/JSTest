let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    console.log("~~~~~~~~~~~~~");
    //获取toke
    //处理请求过来的参数
    //调用接口处理远端请求
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });