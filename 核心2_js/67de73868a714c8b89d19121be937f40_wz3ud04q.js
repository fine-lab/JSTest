let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var proRes = ObjectStore.insert("ISVUDI.ISVUDI.UDIScanRecordv2", request.logObject, "d336b409"); //保存数据 参数1：数据建模的URI  参数2：实体数据   参数3：表单编码
    return { proRes };
  }
}
exports({ entryPoint: MyAPIHandler });