let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let addSysStaffData = request.staff;
    request = {};
    request.uri = "/yonbip/digitalModel/staff/save";
    //同步到系统员工
    request.body = { data: addSysStaffData };
    let func = extrequire("GT34544AT7.common.baseOpenApi");
    let sysStaff = func.execute(request).res;
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });