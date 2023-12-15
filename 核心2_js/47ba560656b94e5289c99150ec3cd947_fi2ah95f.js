let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //查询内容
    var object = {};
    //实体查询
    var res = ObjectStore.selectByMap("GT37398AT27.GT37398AT27.BuildersQuestio1_fu", object);
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });