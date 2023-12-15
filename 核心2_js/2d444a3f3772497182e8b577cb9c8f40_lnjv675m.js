let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    // 组织级别 HRDIWORK030000000027
    let req = {};
    let func1 = extrequire("GT34544AT7.custom.showCustomCnf");
    let accept = func1.execute(req).res;
    let res = accept;
    return { res };
  }
}
exports({ entryPoint: MyTrigger });