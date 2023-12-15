let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var id = request.id;
    var isClose = request.isClose;
    if (!id) {
      return {};
    }
    var object = { id: id, isClose: isClose };
    var res = ObjectStore.updateById("GT5258AT16.GT5258AT16.apply_outs_resource_prl", object, "9053a2cc");
    // 更新条件
    var updateWrapper = new Wrapper();
    updateWrapper.eq("source_id", id);
    // 待更新字段内容
    var toUpdate = { isClose: isClose };
    // 执行更新
    var dutyRes = ObjectStore.update("GT5258AT16.GT5258AT16.duty_outs_resource_prl", toUpdate, updateWrapper, "af1fd42b");
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });