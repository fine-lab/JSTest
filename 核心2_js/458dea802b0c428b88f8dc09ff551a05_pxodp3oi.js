let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let id = request.id; //请求ID
    let syb = request.shiyebu; //事业部ID
    let sybName = request.shiyebu_name; //事业部名称
    var paramsBody = { id: id, shiyebu: syb, shiyebu_name: sybName };
    let rstp = ObjectStore.updateById("AT17854C0208D8000B.AT17854C0208D8000B.khcpjy", paramsBody);
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });