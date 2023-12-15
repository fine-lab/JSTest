let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var { name } = request;
    //获取表的远景Ⅱ的ID
    let querySql = "select id,QuoteBillID,pubts from GT9154AT5.GT9154AT5.QouteBillYJ_cl where 1=1";
    //获取主报价单的ID
    if (name != undefined) {
    }
    var result = ObjectStore.queryByYonQL(querySql);
    return { result: result };
  }
}
exports({ entryPoint: MyAPIHandler });