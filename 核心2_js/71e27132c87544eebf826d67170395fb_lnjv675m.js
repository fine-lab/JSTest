let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let res1 = JSON.parse(AppContext());
    //值是一个currentUser对象
    // 获取当前用户的员工id
    let userId = res1.currentUser.id;
    let name = res1.currentUser.name;
    let data = {
      userIds: [userId]
    };
    request.body = data;
    request.uri = "https://www.example.com/";
    let func1 = extrequire("GT53685AT3.common.baseOpenLinker");
    let res = func1.execute(request).res;
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });