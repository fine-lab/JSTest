let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var sql = "select * from GT65292AT10.GT65292AT10.role_auth_cust order by auth_type_cust desc";
    var res = ObjectStore.queryByYonQL(sql, "developplatform");
    var role_auth_cust = 0; //
    var role_code = "";
    let func1 = extrequire("GT65292AT10.backDefaultGroup.queryRoleV2");
    let newres = func1.execute({});
    for (var i in res) {
      var hasRole = false;
      if (newres && !!newres.usrRole && newres.usrRole.length > 0) {
        for (var j in newres.usrRole) {
          if (newres.usrRole[j].roleId == res[i].role_Id) {
            hasRole = true;
            break;
          }
        }
      }
      if (hasRole == true) {
        role_auth_cust = res[i].auth_type_cust;
        role_code = res[i].role_code;
        break;
      }
    }
    return { role_auth_cust: role_auth_cust, role_code: role_code, AppContext: JSON.parse(AppContext()), newres: newres };
  }
}
exports({ entryPoint: MyAPIHandler });