let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let orderId = "yourIdHere";
    var sqlQuery = "select agentRelationId,agentId,code from voucher.order.Order where agentRelationId is null ";
    var merchantRes = ObjectStore.queryByYonQL(sqlQuery, "udinghuo");
    return { merchantRes };
    //查询销售预订单 主表合计数量、金额与子表数量、金额之和不匹配数据
    return { orderId };
  }
}
exports({ entryPoint: MyAPIHandler });