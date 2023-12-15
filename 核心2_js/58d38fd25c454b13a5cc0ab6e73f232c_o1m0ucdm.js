let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //先插入实体
    var businessId = uuid();
    var sql = "select  * from  GT879AT352.GT879AT352.reqfile where code ='" + request.code + "' ";
    var businessObject = ObjectStore.queryByYonQL(sql);
    if (businessObject.length > 0) {
      businessId = businessObject[0].uploadfile;
    } else {
      var object = { code: request.code, uploadfile: businessId };
      var res = ObjectStore.insert("GT879AT352.GT879AT352.reqfile", object, "e00f895d");
    }
    businessId = "mdf_" + businessId;
    return { businessId };
  }
}
exports({ entryPoint: MyAPIHandler });