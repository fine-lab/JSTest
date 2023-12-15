let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //条件查询实体
    //实体查询 待确定
    //查询内容
    //查询内容
    var ss = request["data"][1]["name"];
    return { l: ss };
  }
}
exports({ entryPoint: MyAPIHandler });