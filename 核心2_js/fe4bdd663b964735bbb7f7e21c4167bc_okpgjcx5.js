let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 执行update修改加急状态
    var id = request.id;
    var url = "GT21859AT11.GT21859AT11.MaterialDemandSec";
    var object = {
      id: id,
      isurgent: false,
      subTable: [
        { hasDefaultInit: true, id: id, _status: "Insert" },
        { id: id, _status: "Delete" }
      ]
    };
    var res = ObjectStore.updateById(url, object);
    return { code: "200" };
  }
}
exports({ entryPoint: MyAPIHandler });