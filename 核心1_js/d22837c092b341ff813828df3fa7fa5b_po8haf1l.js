let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    console.log(request);
    var updateWrapper = new Wrapper();
    updateWrapper.eq("code", request.code);
    // 待更新字段内容
    var toUpdate = { value: request.value };
    // 执行更新
    var res = ObjectStore.update("AT19E102B816A00007.AT19E102B816A00007.CRMPARAM", toUpdate, updateWrapper, "CRMPARAM");
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });