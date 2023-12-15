let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //数据库进行操作
    //更新实体 只更新主表
    return { code: 500 };
  }
}
exports({ entryPoint: MyAPIHandler });