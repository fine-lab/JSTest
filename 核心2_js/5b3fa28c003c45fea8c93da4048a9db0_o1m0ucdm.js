let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取附件中间表的id
    var sql = "select  * from  GT879AT352.GT879AT352.reqfile where code ='" + request.code + "' ";
    var businessObject = ObjectStore.queryByYonQL(sql, "developplatform");
    var id = "";
    if (businessObject.length > 0) {
      id = businessObject[0].id;
    }
    return { id };
  }
}
exports({ entryPoint: MyAPIHandler });