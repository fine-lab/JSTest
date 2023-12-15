let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var bodyData = request.bodyData; //样本信息
    //更新样本信息中的【是否发出报告】
    let bodyUpdate = { id: bodyData.id, zhuangtai: "40", isbg: "true" };
    let updateRes = ObjectStore.updateById("AT15F164F008080007.AT15F164F008080007.recDetils1", bodyUpdate, "63fb1ae5");
    return { updateRes };
  }
}
exports({ entryPoint: MyAPIHandler });