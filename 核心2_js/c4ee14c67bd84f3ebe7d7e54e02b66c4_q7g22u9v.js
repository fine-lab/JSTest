let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //必传项
    var id = request.data.id;
    if (typeof id == "undefined" || id === null) {
      return { error: "请写入id!" };
    }
    if (data.code == "undefined") {
      var result = ObjectStore.updateById("GT59181AT30.GT59181AT30.XPH_MQCType", request.data, "b63875e3");
      return { newData: result };
    } else {
      return { error: "不能修改表格code字段!" };
    }
  }
}
exports({ entryPoint: MyAPIHandler });