let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var creatorId = request.creatorId;
    //查询制单人身份类型
    let sql = "select userType from base.user.User where id=" + creatorId;
    let res = ObjectStore.queryByYonQL(sql, "productcenter");
    if (res.length > 0) {
      var userType = res.userType;
    }
    return { userType: userType };
  }
}
exports({ entryPoint: MyAPIHandler });