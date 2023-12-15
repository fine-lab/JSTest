let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let param = request.param1;
    let apiResponse = "1234";
    let func1 = extrequire("GT19269AT427.backDefaultGroup.get_local_gwInfo");
    let res = func1.execute();
    //调第三方接口
    try {
    } catch (e) {
      return { res: e, param: "321" };
    }
    return { res: res, param: param };
  }
}
exports({ entryPoint: MyAPIHandler });