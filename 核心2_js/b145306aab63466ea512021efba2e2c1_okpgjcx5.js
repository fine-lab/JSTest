let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    debugger;
    // 执行 通过按钮，修改本单据状态，
    var id = request.id;
    var upid = request.upid;
    var url = "GT21859AT11.GT21859AT11.MaterialDemandSec";
    var object = {
      id: id,
      new40: "通过",
      returnreason: "",
      subTable: [
        { hasDefaultInit: true, id: id, _status: "Insert" },
        { id: id, _status: "Delete" }
      ]
    };
    var res = ObjectStore.updateById(url, object);
    //同时修改上游物资申请单的 需求状态字段
    var upurl = "GT21859AT11.GT21859AT11.ceshi002";
    var objectUP = {
      id: upid,
      new51: "二级计划中心通过",
      subTable: [
        { hasDefaultInit: true, id: id, _status: "Insert" },
        { id: id, _status: "Delete" }
      ]
    };
    var ress = ObjectStore.updateById(upurl, objectUP);
    return { code: "200" };
  }
}
exports({ entryPoint: MyAPIHandler });