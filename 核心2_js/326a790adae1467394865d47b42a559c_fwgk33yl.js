let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var oppt_id = request.oppt_id;
    var sql = "select verifystate from GT65292AT10.GT65292AT10.oppt_support_collect where Oppt = '" + oppt_id + "' and tenant_id=fwgk33yl";
    var res = ObjectStore.queryByYonQL(sql, "developplatform");
    var result = 0; //0=无汇总单 1=待审核 2=已审核通过
    if (res && res.length > 0) {
      for (var i in res) {
        if (res[i].verifystate == 2) {
          result = 2;
        }
        if (result != 2 && res[i].verifystate == 1) {
          result = 1;
        }
      }
    }
    return { result };
  }
}
exports({ entryPoint: MyAPIHandler });