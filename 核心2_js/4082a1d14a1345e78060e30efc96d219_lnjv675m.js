let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 需要传入区域编码
    var areaorgcode = request.areacode;
    var areacode = substring(areaorgcode, 1, 7) + "000000";
    let func1 = extrequire("GT34544AT7.authManager.getAppContext");
    let cu = func1.execute(request).res;
    let currentUser = cu.currentUser;
    let staffId = currentUser.staffId;
    var agscondition = { sysStaff: staffId };
    var agstaffs = ObjectStore.selectByMap("GT1559AT25.GT1559AT25.AgentStaff", agscondition);
    var gcscondition = { sysStaff: staffId };
    var gcstaffs = ObjectStore.selectByMap("GT1559AT25.GT1559AT25.GxyCustomerStaff", gcscondition);
    let res = {
      status: 0,
      num: 0
    };
    if (agstaffs.length > 0) {
      var agstaff = agstaffs[0];
      var agentOrg = agstaff.agentOrg;
      var ags = ObjectStore.selectByMap("GT1559AT25.GT1559AT25.AgentOrg", { id: agentOrg });
      if (ags.length > 0) {
        let ag = ags[0];
        let gxyCustomer = ag.gxyCustomer;
        var gcs = ObjectStore.selectByMap("GT1559AT25.GT1559AT25.AgentG_org", { GxyCustomer_id: gxyCustomer, code: areacode });
        if (gcs.length > 0) {
          let gc = gcs[0];
          let num = gc.limitUser;
          res.num = num;
          if (num > 0) {
            res.status = 1;
          }
        } else {
          res.msg = "代账组织没有授权";
        }
      } else {
        res.msg = "代账组织找不到";
      }
    } else if (gcstaffs.length > 0) {
      var gcs = gcstaffs[0];
      var gxyCustomer = gcs.gxyCustomer;
      var gcs = ObjectStore.selectByMap("GT1559AT25.GT1559AT25.AgentA_org", { GxyCustomer_id: gxyCustomer, code: areacode });
      if (gcs.length > 0) {
        let gc = gcs[0];
        let num = gc.limitUser;
        res.num = num;
        if (num > 0) {
          res.status = 1;
        }
      } else {
        res.msg = gxyCustomer + ":客户，没有授权" + areacode;
      }
    }
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });