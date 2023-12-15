let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    if (request.orderIds == undefined) {
      return { info: [], error: "orderIds必填" };
    }
    if (!Array.isArray(request.orderIds)) {
      return { info: [], error: "orderIds必须为数组" };
    }
    if (request.orderIds.length == 0) {
      return { info: [], error: "orderIds不能为空" };
    }
    let yonql = "select * from pu.arrivalorder.ArrivalOrder where id in (";
    for (let i = 0; i < request.orderIds.length; i++) {
      yonql += "'" + request.orderIds[i] + "',";
    }
    yonql = yonql.substring(0, yonql.length - 1) + ")";
    let arrivalOrders = ObjectStore.queryByYonQL(yonql, "upu");
    //查询子表
    for (let i = 0; i < arrivalOrders.length; i++) {
      let yonql1 = "select * from pu.arrivalorder.ArrivalOrders where mainid ='" + arrivalOrders[i].id + "'";
      arrivalOrders[i].entry = ObjectStore.queryByYonQL(yonql1, "upu");
    }
    return { info: arrivalOrders };
  }
}
exports({ entryPoint: MyAPIHandler });