let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    debugger;
    var object = {
      id: "youridHere",
      email: "https://www.example.com/"
    };
    var res = ObjectStore.updateById("AT1619118217600004.AT1619118217600004.userInfoCode", object, "userAddList");
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });