let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let res = [];
    if (param.data[0].x_status === "Insert") {
      let ouserId = param.data[0].IndustryUsers_id;
      if (ouserId === null || ouserId === undefined) {
        throw new Error("未取到行业用户信息");
      }
      let req = { id: ouserId };
      let func1 = extrequire("GT34544AT7.ownUser.showOwnUserById");
      let res1 = func1.execute(req).res;
      let userId = res1[0].userId;
      if (userId === undefined || userId === null || userId === "") {
        throw new Error("未取到userId");
      }
      let func2 = extrequire("GT34544AT7.authManager.setAreaAdminRole");
      req.userId = userId;
      let res2 = func2.execute(req).res;
      // 设置授权权限
      let func3 = extrequire("GT34544AT7.authManager.setAuthAdminRole");
      req.userId = userId;
      let res3 = func3.execute(req).res;
      res.push(res2);
      res.push(res3);
    }
    return { res };
  }
}
exports({ entryPoint: MyTrigger });