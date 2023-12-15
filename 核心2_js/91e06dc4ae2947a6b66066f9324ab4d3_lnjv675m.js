let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let serviceCode = request.serviceCode;
    let func1 = extrequire("GT34544AT7.authManager.getAppContext");
    let cu = func1.execute(request).res;
    let currentUser = cu.currentUser;
    let staffId = currentUser.staffId;
    let userId = currentUser.id;
    let newOrgManager = {};
    var service = {};
    var servicecondition = { serviceCode: serviceCode };
    var services = ObjectStore.selectByMap("GT1559AT25.GT1559AT25.CusAppService", service);
    if (services.length > 0) {
      service = services[0];
      if (service.orgNum <= service.useOrgNum) {
        throw new Error("服务可用额度已用完");
      } else {
        // 更新服务
        let serviceparam = { id: service.id, useOrgNum: service.useOrgNum + 1 };
        newOrgManager = ObjectStore.updateById("GT1559AT25.GT1559AT25.CusAppService", serviceparam, "07c1470f");
      }
    } else {
      throw new Error("领域未登记");
    }
    var cuser = {};
    var gcscondition = { CusAppService_id: service.id, userid: userId, staffid: staffId };
    var gcss = ObjectStore.selectByMap("GT1559AT25.GT1559AT25.CusAppService_User", gcscondition);
    if (gcss.length > 0) {
      cuser = gcss[0];
    } else {
      throw new Error("用户未登记");
    }
    let res = newOrgManager;
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });