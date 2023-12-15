let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var object = request.data;
    var time = request.time;
    //删除当天的数据
    //插入数据
    var res = ObjectStore.insertBatch("GT8954AT173.GT8954AT173.dsp", object, "50193f76");
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });