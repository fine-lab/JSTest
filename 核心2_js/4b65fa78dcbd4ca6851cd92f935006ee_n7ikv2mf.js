let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var id = request.id;
    if (!id) {
      return {};
    }
    var object = { id: id, isClose: "N" };
    var res = ObjectStore.updateById("GT5258AT16.GT5258AT16.apply_outs_resource", object, "c28d8f19");
    // 更新条件
    var updateWrapper = new Wrapper();
    updateWrapper.eq("source_id", id);
    // 待更新字段内容
    var toUpdate = { isClose: "N" };
    // 执行更新
    var dutyRes = ObjectStore.update("GT5258AT16.GT5258AT16.duty_outs_resource", toUpdate, updateWrapper, "8e14591f");
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });