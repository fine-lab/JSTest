let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取用户ID
    var appContextString = AppContext();
    var appContext = JSON.parse(appContextString);
    var userId = appContext.currentUser.id;
    var tenantId = appContext.currentUser.tenantId;
    var sql =
      'select RoleCode from sys.auth.UserRoleImport where RoleCode  in(DRAWING_SEAL,QUOTATION_SEAL,OFFICIAL_SEAL,CONTRACT_SEAL,BUSINESS01_SEAL,BUSINESS02_SEAL)    and  yhtUser="' +
      userId +
      '"  and tenant="' +
      tenantId +
      '"';
    let res = ObjectStore.queryByYonQL(sql, "u8c-auth");
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });