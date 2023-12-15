let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 执行update 修改 重点物资状态
    var id = request.id;
    var url = "GT21859AT11.GT21859AT11.MaterialDemandSec";
    var object = {
      id: id,
      isKeymaterials: true,
      new39: "",
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