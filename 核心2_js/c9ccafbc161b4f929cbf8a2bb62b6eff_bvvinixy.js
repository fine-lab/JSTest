let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let bill = param.data[0].org_id;
    // 更新条件
    var updateWrapper = new Wrapper();
    // 书本分类名为计算机类、件数>200
    updateWrapper.eq("org_id", bill);
    // 待更新字段内容
    var toUpdate = { dr: 1, _status: "Update" };
    var res = ObjectStore.update("maintenance.maintenance.m_s_scheduling", toUpdate, updateWrapper, "d3ac839a");
    return {};
  }
}
exports({ entryPoint: MyTrigger });