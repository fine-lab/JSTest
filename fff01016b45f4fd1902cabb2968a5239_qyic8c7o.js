let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取当前用户的身份信息-----------
    var currentUser = JSON.parse(AppContext()).currentUser; //通过上下文获取当前的用户信息
    var isAdmin = 0;
    var adminList = ["https://www.example.com/", "https://www.example.com/", "https://www.example.com/", "https://www.example.com/", "https://www.example.com/", "https://www.example.com/"];
    var readOnlyList = ["https://www.example.com/", "https://www.example.com/", "https://www.example.com/", "https://www.example.com/", "https://www.example.com/", "https://www.example.com/"];
    if (adminList.indexOf(currentUser.email) > -1) {
      isAdmin = 1;
    }
    if (readOnlyList.indexOf(currentUser.email) > -1) {
      isAdmin = 2;
    }
    return { currentUser, isAdmin };
  }
}
exports({ entryPoint: MyAPIHandler });