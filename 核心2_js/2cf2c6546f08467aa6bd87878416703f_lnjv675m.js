let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let ouserId = param.data[0].IndustryUsers_id;
    let req = { id: ouserId };
    let func1 = extrequire("GT34544AT7.ownUser.showOwnUserById");
    let res1 = func1.execute(req).res;
    let userId = res1[0].userId;
    // 设置其他权限
    let func4 = extrequire("GT34544AT7.roles.bindRolesByMyRole");
    req.userId = userId;
    req.staffId = param.data[0].staff_id;
    req.insUserId = ouserId;
    let res = func1.execute(req).res;
    return { res };
  }
}
exports({ entryPoint: MyTrigger });