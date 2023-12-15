let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    const { tenantId, orgId, deptId } = request;
    var sql = "select * from hred.staff.StaffJob where  enable=1 and orgId='" + orgId + "' and deptId='" + deptId + "' and dr=0 and tenant='" + tenantId + "' and sysid='youridHere'"; // 任职信息
    var res = ObjectStore.queryByYonQL(sql, "ucfbasedoc");
    return { data: res };
  }
}
exports({ entryPoint: MyAPIHandler });