let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var did = request.id;
    var jcddData = request.data;
    var checkStatus = jcddData.checkStatus;
    if (checkStatus == 30) {
      throw new Error("此订单是：已经是终止状态了");
    }
    //更检测订单状态；
    var object = { id: did, checkStatus: "30" };
    var updateDetectOrder = ObjectStore.updateById("AT15F164F008080007.AT15F164F008080007.DetectOrder", object, "71a4dca4");
    //更改收样单状态；
    var sydId = jcddData.Upstreamid;
    var objectsyd = { id: sydId, checkStatus: "30" };
    var updaterecDetils = ObjectStore.updateById("AT15F164F008080007.AT15F164F008080007.recDetils1", objectsyd, "63fb1ae5");
    return { updaterecDetils };
  }
}
exports({ entryPoint: MyAPIHandler });