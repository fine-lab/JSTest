let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var object = {
      data_type: request.data_type,
      danjubianma: request.danjubianma,
      data_sync_result: request.data_sync_result,
      des: request.des,
      data_time: request.data_time
    };
    var res = ObjectStore.insert("AT167004801D000002.AT167004801D000002.data_log", object, "084abbe6"); // 084abbe6
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });