let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    debugger;
    var id = request.id;
    var sign = "未签字"; //是否已签字
    var url = "GT21859AT11.GT21859AT11.income_detail1";
    var object = {
      id: id,
      sign: sign,
      subTable: [
        { hasDefaultInit: true, id: id, _status: "Insert" },
        { id: id, _status: "Delete" }
      ]
    };
    var res = ObjectStore.updateById(url, object);
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });