let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let userId = JSON.parse(AppContext()).currentUser.id;
    let tenantId = JSON.parse(AppContext()).currentUser.tenantId;
    //查询用户角色
    let userRoleSql = "select *，role.* from sys.auth.UserRole where tenant='" + tenantId + "' and yhtUser='" + userId + "'";
    //查询角色权限
    let roleAuthReferSql = "select * from sys.auth.RoleAuthRefer where role = '89994b80-2ddd-486b-97af-4d4fe65de6f4'";
    //查询管控维度
    let authReferSql = "select *,managerRefer.* from sys.auth.AuthRefer where id in ('1565136076226953217','1565138464235061253')";
    //查询权限规则
    let authReferRuleSql = "select * from sys.auth.AuthReferRule where authRefer in ('1565136076226953217','1565138464235061253')";
    let authReferParameter = "select * from sys.auth.AuthReferParameter";
    var res = ObjectStore.queryByYonQL(authReferParameter, "u8c-auth");
    throw new Error(JSON.stringify(res));
    return {};
  }
}
exports({ entryPoint: MyTrigger });