let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let requestData = JSON.parse(param.requestData);
    // 更新条件
    var updateWrapper = new Wrapper();
    updateWrapper.eq("id", requestData.id);
    // 待更新字段内容
    var toUpdate = { pay_status_id: 2 };
    // 执行更新
    var object = { id: requestData.id, pay_status_id: "2" };
    var res = ObjectStore.updateById("AT161424B609D00005.AT161424B609D00005.order_payment", object);
  }
}
exports({ entryPoint: MyTrigger });