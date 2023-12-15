let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var object = request.data;
    //插入数据
    var res = ObjectStore.insertBatch("GT11621AT184.GT11621AT184.dayclosebill", object, "50193f76");
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });