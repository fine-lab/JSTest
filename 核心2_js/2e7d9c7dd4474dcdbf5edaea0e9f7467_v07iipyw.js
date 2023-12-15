let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var typeName = request.typeName; //获取图书分类
    var sql = 'select typeCode , id from GT39030AT17.GT39030AT17.bookType where typeName = "' + typeName + '"';
    var res = ObjectStore.queryByYonQL(sql)[0];
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });