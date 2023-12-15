let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let id = request.id;
    let param = {
      ids: [id]
    };
    let func1 = extrequire("GT13847AT1.myutil.UserApiUtil");
    let tmp = func1.execute({
      url: "https://www.example.com/",
      param: param
    });
    return tmp;
  }
}
exports({ entryPoint: MyAPIHandler });