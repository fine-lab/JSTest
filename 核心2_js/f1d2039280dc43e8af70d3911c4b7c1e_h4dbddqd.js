let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var object = request.data;
    //插入数据
    var res = ObjectStore.insertBatch("GT13741AT37.GT13741AT37.dayclosebill", object, "e297ef0b");
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });