let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //必传项
    var id = request.data.id;
    if (typeof id == "undefined" || id === null) {
      return { error: "请写入id!" };
    }
    var result = ObjectStore.updateById("GT59181AT30.GT59181AT30.XPH_MQC", request.data, "77c2dd0e");
    return { newData: result };
  }
}
exports({ entryPoint: MyAPIHandler });