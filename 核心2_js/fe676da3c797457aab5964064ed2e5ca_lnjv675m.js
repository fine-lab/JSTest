let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let tel = param.data[0]["userMobile"];
    let func1 = extrequire("GT34544AT7.staff.searchStaffByTel");
    let request = { tel: tel };
    let res = func1.execute(request).res;
    let staff = null;
    // 如果员工已经在租户里面
    if (res.data.length > 0) {
      staff = res.data[0];
    } else {
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });