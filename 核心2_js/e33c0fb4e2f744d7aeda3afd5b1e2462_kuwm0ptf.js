let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let func1 = extrequire("GT16352AT9.backDefaultGroup.getTokenBack");
    let func2 = extrequire("GT16352AT9.backDefaultGroup.getToken");
    let res = func2.execute(); //func1.execute();
    return { res: res };
  }
}
exports({ entryPoint: MyAPIHandler });