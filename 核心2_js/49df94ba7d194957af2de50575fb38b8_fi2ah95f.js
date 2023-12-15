let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var phone = request["phone"];
    var object = {};
    var res = ObjectStore.selectByMap("GT37398AT27.GT37398AT27.Construction2_fu", object);
    var updateWrapper = new Wrapper();
    updateWrapper.eq("phone", request.phone);
    // 待更新字段内容
    var toUpdate = { qualified: true };
    // 执行更新
    var res = ObjectStore.update("GT37398AT27.GT37398AT27.Construction2_fu", toUpdate, updateWrapper, "6ca2dc6f");
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });