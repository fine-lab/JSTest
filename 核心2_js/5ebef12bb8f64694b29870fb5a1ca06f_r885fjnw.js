let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取员工id
    let staffId = ObjectStore.user().staffId;
    let orderid = request.Map.id;
    let principal = request.Map.operatoRprincipal;
    if (staffId == principal) {
      var object = { id: orderid, isRejected: "Y" };
      var res = ObjectStore.updateById("AT1745F50C09180004.AT1745F50C09180004.caseInfoMaintain", object, "yb6ce924b4");
      return { res };
    }
  }
}
exports({ entryPoint: MyAPIHandler });