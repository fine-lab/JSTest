let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var updateWrapper = new Wrapper();
    updateWrapper.eq("appkey", request.app_key);
    // 待更新字段内容
    var toUpdate = { jstCode: request.code };
    // 执行更新
    var res = ObjectStore.update("AT167004801D000002.AT167004801D000002.jst_config", toUpdate, updateWrapper, "e91bc0cf");
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });