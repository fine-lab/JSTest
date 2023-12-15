let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取当前用户的身份信息-----------
    let currentUser = JSON.parse(AppContext()).currentUser; //通过上下文获取当前的用户信息
    let sysId = "yourIdHere";
    let tenantId = currentUser.tenantId;
    let userId = currentUser.id;
    let userIds = [userId];
    let roles = ObjectStore.queryByYonQL(
      'select role as roleId,yhtUser as userId from sys.auth.UserRole where yhtUser="' + userId + '"  and tenant="' + tenantId + '"' + " and systemCode='" + sysId + "'",
      "u8c-auth"
    );
    let roleInfo = null;
    let result = listOrgAndDeptByUserIds(sysId, tenantId, userIds);
    let listSql =
      "select * from GT8566AT282.GT8566AT282.learning_plan_ydzs_1 left join GT8566AT282.GT8566AT282.learning_plan_range_1 r on r.learning_plan_ydzs_1_id = id where enable = 1 and r.staffNew = '" +
      currentUser.staffId +
      "'";
    let listResult = ObjectStore.queryByYonQL(listSql);
    return { currentUser: currentUser, user_id: userId, res: JSON.parse(result), roles: roles, listResult: listResult };
  }
}
exports({ entryPoint: MyAPIHandler });