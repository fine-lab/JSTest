let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var queryId = request.id;
    var queryhSql = "select * from GT83441AT1.GT83441AT1.salesAdvanceOrder where id='" + queryId + "'";
    var hRes = ObjectStore.queryByYonQL(queryhSql, "developplatform");
    var returnData = {};
    if (hRes.length > 0) {
      returnData = hRes[0];
      //通过上下文获取当前的用户信息
      var currentUser = JSON.parse(AppContext()).currentUser;
      //查询组织信息
      var sysId = "yourIdHere";
      var tenantId = currentUser.tenantId;
      var userSql = "select * from yhtTenantBase.user.User	where yhtTenantId=" + tenantId + " and  yhtUserId='" + returnData.creator + "'";
      var userRes = ObjectStore.queryByYonQL(userSql, "productcenter");
      if (userRes.length > 0) {
        returnData.creatorId = userRes[0].id; //用户管理中的主键
        returnData.creatorName = userRes[0].name; //用户管理中的名称
      }
      //查询子表数据
      var querybSql = "select * from GT83441AT1.GT83441AT1.salesAdvanceOrder_b where dr=0 and salesAdvanceOrder_id='" + queryId + "'";
      var bRes = ObjectStore.queryByYonQL(querybSql, "developplatform");
      if (bRes.length > 0) {
        returnData.salesAdvanceOrder_bList = bRes;
      }
    }
    return { returnData };
  }
}
exports({ entryPoint: MyAPIHandler });