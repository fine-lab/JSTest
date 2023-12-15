let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var id = request.id;
    var uri = "pu.arrivalorder.ArrivalOrders"; // uri
    var object = {
      id: id,
      XXX: "未验收",
      subTable: [
        { hasDefaultInit: true, _status: "Insert" },
        { id: id, _status: "Delete" }
      ]
    };
    var res = ObjectStore.updateById(uri, object);
    return { shifoushi: "shifoushi", request: request };
  }
}
exports({ entryPoint: MyAPIHandler });