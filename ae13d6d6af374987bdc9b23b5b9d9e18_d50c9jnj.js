let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let id = request.id;
    let sconfigFunc = extrequire("GT37595AT2.commonFun.sConfigFunc");
    let sconfig = sconfigFunc.execute();
    // 获取当前登陆人yyUserId
    var currentUser = JSON.parse(AppContext()).currentUser;
    let notTodoUrl = "https://www.example.com/";
    let notTodoData = {
      appId: sconfig.BASE.ordersAppId,
      yhtUserId: currentUser.id,
      businessKey: "yourKeyHere" + id
    };
    let notTodoResponse = openLinker("POST", notTodoUrl, "PU", JSON.stringify(notTodoData));
    notTodoResponse = JSON.parse(notTodoResponse);
    if (notTodoResponse.code != "200" || notTodoResponse.data.length == 0) {
      return {};
    }
    let todoData = {
      srcMsgId: uuid(),
      businessKey: "yourKeyHere" + id,
      appId: sconfig.BASE.ordersAppId,
      yyUserId: currentUser.id
    };
    let todoUrl = "https://www.example.com/";
    let todoRes = openLinker("POST", todoUrl, "PU", JSON.stringify(todoData));
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });