let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let ids = request.dd.id;
    let age = request.dd.age;
    //添加
    //删除
    var sql = "select typeCode,typeName from AT183D470E09480002.AT183D470E09480002.type ";
    var res = ObjectStore.queryByYonQL(sql);
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });