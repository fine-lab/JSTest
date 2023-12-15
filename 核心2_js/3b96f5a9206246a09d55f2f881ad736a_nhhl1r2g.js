let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //查询内容
    var object = [
      { uordercorp: 2916735993630784, isDeleted: false, orderId: "yourIdHere", usedMoney: 100, id: "youridHere", pubts: "2022-10-26 15:37:32", rebateId: "yourIdHere" }
    ];
    //实体查询
    //数据修改
    ObjectStore.updateById("voucher.order.RebateRecord", object);
    return { request };
  }
}
exports({ entryPoint: MyAPIHandler });