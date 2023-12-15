let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 执行update 修改 重点物资状态
    var id = request.id;
    var reason = request.reason;
    let bizFlowName = request.bizFlowName;
    let cbillcode = request.cbillcode;
    var url = "GT21859AT11.GT21859AT11.MaterialDemandSec";
    var object = {
      id: id,
      isKeymaterials: false,
      new39: reason,
      subTable: [
        { hasDefaultInit: true, id: id, _status: "Insert" },
        { id: id, _status: "Delete" }
      ]
    };
    var res = ObjectStore.updateById(url, object);
    debugger;
    //添加日志
    var objectlog = {
      model: bizFlowName,
      reason: reason,
      operation: "取消重点物资",
      cid: id,
      cbillcode: cbillcode,
      subTable: [{ key: "yourkeyHere" }]
    };
    res = ObjectStore.insert("GT21859AT11.GT21859AT11.MaterialMStatuslog", objectlog, "12659610");
    return { code: "200" };
  }
}
exports({ entryPoint: MyAPIHandler });