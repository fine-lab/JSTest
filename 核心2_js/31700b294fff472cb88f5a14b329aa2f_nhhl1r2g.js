let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //查询内容
    var object = {
      id: "实体id"
    };
    //实体查询
    return { request };
  }
}
exports({ entryPoint: MyAPIHandler });