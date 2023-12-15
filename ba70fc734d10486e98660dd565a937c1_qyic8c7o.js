let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var isCreator = false;
    var res = "";
    const code = request.code;
    //通过上下文获取当前的用户信息
    var currentUser = JSON.parse(AppContext()).currentUser;
    if (code) {
      var sql = "select creator　from AT1601E07C17400008.AT1601E07C17400008.pre_invested_outsource_bill where code='" + code + "'";
      res = ObjectStore.queryByYonQL(sql);
      if (res && res[0].creator == currentUser.id) {
        isCreator = true;
      }
    }
    return {
      isCreator
    };
  }
}
exports({
  entryPoint: MyAPIHandler
});