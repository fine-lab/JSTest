let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //查询内容
    var res = ObjectStore.selectByMap("GT62830AT6.GT62830AT6.caigouceshi123", request);
    return { res: res };
  }
}
exports({ entryPoint: MyAPIHandler });