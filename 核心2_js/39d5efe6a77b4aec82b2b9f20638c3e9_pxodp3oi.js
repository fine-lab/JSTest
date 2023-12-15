let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let id = request.id; //请求ID
    let syb = request.staffNew; //事业部ID
    let sybName = request.staffNew_name; //事业部名称
    var paramsBody = { id: id, staffNew: syb, staffNew_name: sybName };
    let rstp = ObjectStore.updateById("AT17854C0208D8000B.AT17854C0208D8000B.jfgddjb", paramsBody);
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });