let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let userId = request.userId;
    if (!userId) {
      var currentUser = JSON.parse(AppContext()).currentUser;
      userId = currentUser.id;
    }
    let body = {
      userId: [userId]
    };
    let url = "https://www.example.com/";
    let apiResponse = openLinker("POST", url, "GT5258AT16", JSON.stringify(body));
    return JSON.parse(apiResponse);
  }
}
exports({ entryPoint: MyAPIHandler });