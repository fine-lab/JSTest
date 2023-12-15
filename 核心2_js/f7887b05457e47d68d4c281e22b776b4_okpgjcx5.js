let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var id = request.id;
    var uri = "pu.arrivalorder.ArrivalOrders"; // uri
    // 查询
    // 修改
    var object = {
      id: id,
      retailAgentName: "已验收",
      productDesc: "胡华测试",
      subTable: [
        { hasDefaultInit: true, _status: "Insert" },
        { id: id, _status: "Delete" }
      ]
    };
    var object1 = { id: id, retailAgentName: "已验收", productDesc: "胡华测试" };
    var res = ObjectStore.updateById(uri, object1, "upu-web");
    return { request: request };
  }
}
exports({ entryPoint: MyAPIHandler });