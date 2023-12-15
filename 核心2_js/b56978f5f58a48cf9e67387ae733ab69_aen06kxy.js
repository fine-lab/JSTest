let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var nowDate = formatDateTime(new Date());
    var updateWrapper1 = new Wrapper();
    updateWrapper1.eq("order_status", "待使用").le("end_time", nowDate);
    // 待更新字段内容
    var toUpdate1 = { order_status: "已完成" };
    // 执行更新
    ObjectStore.update("GT16804AT364.GT16804AT364.board_room_order", toUpdate1, updateWrapper1, "e21b5656");
    var updateWrapper2 = new Wrapper();
    updateWrapper2.eq("order_status", "待使用").le("start_time", nowDate).ge("end_time", nowDate);
    // 待更新字段内容
    var toUpdate2 = { order_status: "使用中" };
    // 执行更新
    ObjectStore.update("GT16804AT364.GT16804AT364.board_room_order", toUpdate2, updateWrapper2, "e21b5656");
    return {};
  }
}
exports({ entryPoint: MyTrigger });