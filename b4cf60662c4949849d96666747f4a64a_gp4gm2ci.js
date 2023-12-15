let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let userID = ObjectStore.user().id;
    //操作名称
    var name = request.name;
    //操作人
    var operator = userID; //request.operator;
    //操作时间
    var time = request.time;
    var object = { mingchen: name, caozuoyonghu: operator, shijian: time };
    var res = ObjectStore.insert("AT189A414C17580004.AT189A414C17580004.czjlrecord", object, "czjlrecord");
    return { data: res.id };
  }
}
exports({ entryPoint: MyAPIHandler });