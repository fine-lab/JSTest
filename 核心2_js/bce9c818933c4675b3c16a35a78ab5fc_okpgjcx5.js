let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    debugger;
    // 驳回按钮 执行update 修改
    var id = request.id;
    var reason = request.reason;
    let bizFlowName = request.bizFlowName;
    let cbillcode = request.cbillcode;
    var url = "GT21859AT11.GT21859AT11.MaterialDemandSec";
    var object = {
      id: id,
      new40: "驳回",
      returnreason: reason,
      subTable: [
        { hasDefaultInit: true, id: id, _status: "Insert" },
        { id: id, _status: "Delete" }
      ]
    };
    var res = ObjectStore.updateById(url, object);
    //同时修改上游物资申请单的 需求状态字段
    var upid = request.upid;
    var upurl = "GT21859AT11.GT21859AT11.ceshi002";
    var objectUP = {
      id: upid,
      new51: "二级计划中心驳回",
      subTable: [
        { hasDefaultInit: true, id: id, _status: "Insert" },
        { id: id, _status: "Delete" }
      ]
    };
    var ress = ObjectStore.updateById(upurl, objectUP);
    //添加日志
    var objectlog = {
      model: bizFlowName,
      reason: reason,
      operation: "驳回",
      cid: id,
      cbillcode: cbillcode,
      subTable: [{ key: "yourkeyHere" }]
    };
    var resss = ObjectStore.insert("GT21859AT11.GT21859AT11.MaterialMStatuslog", objectlog, "12659610");
    return { code: "200" };
  }
}
exports({ entryPoint: MyAPIHandler });