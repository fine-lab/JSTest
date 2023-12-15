let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 获取请求参数
    var id = request.id;
    var smallBillNumber = request.smallBillNumber;
    var orderDate = request.orderDate;
    var object = { id: id, smallBillNumber: smallBillNumber, orderDate: orderDate, compositions: [{ name: "goodsOrdeDetailList" }] };
    var res = ObjectStore.selectByMap("AT16879EEA1CB0000A.AT16879EEA1CB0000A.goodsOrder", object);
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });