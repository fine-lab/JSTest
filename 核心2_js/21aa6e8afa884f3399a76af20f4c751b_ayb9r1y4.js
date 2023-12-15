let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let id = request.id;
    let state = request.state;
    // 更新条件
    var updateWrapper = new Wrapper();
    updateWrapper.eq("id", id);
    // 待更新字段内容
    var toUpdate = { getState: state };
    // 执行更新
    var res = ObjectStore.update("GT102917AT3.GT102917AT3.Beforetheconstruction", toUpdate, updateWrapper, "93616421");
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });