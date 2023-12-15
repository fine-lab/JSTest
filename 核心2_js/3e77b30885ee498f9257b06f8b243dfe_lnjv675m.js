let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let uri = "https://www.example.com/";
    let body = {
      data: [
        {
          id: request.id
        }
      ]
    };
    request.uri = uri;
    request.body = body;
    let func1 = extrequire("GT53685AT3.common.baseOpenLinker");
    let res = func1.execute(request);
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });