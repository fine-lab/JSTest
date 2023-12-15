let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var id = request.id; // 要弃审的当前单据的ID
    var bills = request.bills;
    var errors = [];
    // 校验当前单据是否存在未删除的下游单据
    for (var i = 0; i < bills.length; i++) {
      var uri = bills[i].uri;
      var name = bills[i].name;
      // 拼装公用SQL
      var sqlstr = "select code from  " + uri + " where source_id =" + id;
      var queryObj = ObjectStore.queryByYonQL(sqlstr);
      if (queryObj != null && queryObj.length > 0) {
        for (var j = 0; j < queryObj.length; j++) {
          var errStr = name + "【" + queryObj[i].code + "】";
          errors.push(errStr);
        }
      }
    }
    // 拼装错误返回提示
    if (errors.length > 0) {
      var errStr = "单据存在下游单据：";
      for (var i = 0; i < errors.length; i++) {
        errStr = errStr + (errStr.length == 0 ? "" : "\n");
        errStr = errStr + errors[i];
      }
      errStr = errStr + "，请删除这些单据再弃审！";
      return { errInfo: errStr };
    }
    return { flag: true };
  }
}
exports({ entryPoint: MyAPIHandler });