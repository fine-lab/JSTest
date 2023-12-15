let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //更新预估工作量
    var object = {};
    var res = ObjectStore.selectByMap("GT5258AT16.GT5258AT16.apply_outs_resource", object);
    for (var num = 0; num < res.length; num++) {
      var app = res[num];
      var workAmount = app.personNum * expectPeriod;
      var uobject = { id: app.id, workAmount: workAmount };
      var res = ObjectStore.updateById("GT5258AT16.GT5258AT16.apply_outs_resource", uobject, "c28d8f19");
      // 更新条件
      var updateWrapper = new Wrapper();
      updateWrapper.eq("source_id", app.id);
      // 待更新字段内容
      var toUpdate = { workAmoun2: workAmount };
      // 执行更新
      var res = ObjectStore.update("GT5258AT16.GT5258AT16.duty_outs_resource", toUpdate, updateWrapper, "8e14591f");
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });