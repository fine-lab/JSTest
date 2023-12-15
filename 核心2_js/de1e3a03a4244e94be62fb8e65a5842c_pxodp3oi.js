let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let code = request.code;
    let id = request.id;
    var object = { id: id, new91: code, isWfControlled: "1" };
    var data = ObjectStore.updateById("GT3734AT5.GT3734AT5.QYSQD", object); //,'developplatform'
    return { data };
  }
}
exports({ entryPoint: MyAPIHandler });