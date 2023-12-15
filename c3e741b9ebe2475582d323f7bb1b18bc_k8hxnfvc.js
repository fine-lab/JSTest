let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var currentUser = JSON.parse(AppContext()).currentUser; //通过上下文获取当前的用户信息
    let body = {
      userId: [currentUser.id]
    };
    let url = "https://www.example.com/";
    let apiResponse = openLinker("POST", url, "ycSouringInquiry", JSON.stringify(body));
    return JSON.parse(apiResponse).data.data[0];
  }
}
exports({ entryPoint: MyAPIHandler });