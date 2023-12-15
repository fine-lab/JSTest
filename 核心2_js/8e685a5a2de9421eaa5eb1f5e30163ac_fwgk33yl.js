let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var oppt_id = request.oppt_id;
    var sql = "select * from GT65292AT10.GT65292AT10.PresaleAppon where BusinessName = '" + oppt_id + "'";
    var res = ObjectStore.queryByYonQL(sql, "developplatform");
    var result = 0; //0=无申请单 2、5=已审核或有未评分的申请单 1=审核中
    if (res && res.length > 0) {
      for (var i in res) {
        if (res[i].verifystate == 2 || res[i].verifystate == 5) {
          result = 2;
          break;
        }
      }
    }
    return { result: result, res: res };
  }
}
exports({ entryPoint: MyAPIHandler });