let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 需要传入区域编码
    var areaorgcode = request.areacode;
    var areacode = substring(areaorgcode, 1, 8) + "000000";
    let func1 = extrequire("GT34544AT7.authManager.getAppContext");
    let cu = func1.execute(request).res;
    let currentUser = cu.currentUser;
    let staffId = currentUser.staffId;
    var agscondition = { sysStaff: staffId };
    var agstaffs = ObjectStore.selectByMap("GT1559AT25.GT1559AT25.AgentStaff", agscondition);
    let res = {};
    let status = 0;
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
          if (num > 0) {
            let change = { id: gc.id, limitUser: num - 1 };
            res = ObjectStore.updateById("GT1559AT25.GT1559AT25.AgentG_org", change, "c36afd11");
            status = 1;
          }
        }
      }
    }
    return { res, status };
  }
}
exports({ entryPoint: MyAPIHandler });