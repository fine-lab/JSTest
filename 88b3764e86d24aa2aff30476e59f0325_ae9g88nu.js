let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 更新条件
    let id = request.id;
    let num = request.num;
    let audittype = request.audittype;
    var updateWrapper = new Wrapper();
    var res0;
    updateWrapper.eq("id", id);
    if (null != id && "" != id && undefined != id) {
      let sqlstr0 = "select applications_number from   GT22176AT10.GT22176AT10.SY01_pro_sreport_v3 where id =" + id;
      let returns0 = ObjectStore.queryByYonQL(sqlstr0);
      let applicationsnumber = returns0[0].applications_number - num;
      var tmp0 = { applications_number: applicationsnumber };
      let applicationsnumber1 = returns0[0].applications_number + num;
      var tmp = { applications_number: applicationsnumber1 };
      if (audittype == "0") {
        res0 = ObjectStore.update("GT22176AT10.GT22176AT10.SY01_pro_sreport_v3", tmp0, updateWrapper, "c2d5f5ea");
      } else if (audittype == "1") {
        res0 = ObjectStore.update("GT22176AT10.GT22176AT10.SY01_pro_sreport_v3", tmp, updateWrapper, "c2d5f5ea");
      }
    }
    return { res: res0 };
  }
}
exports({ entryPoint: MyAPIHandler });