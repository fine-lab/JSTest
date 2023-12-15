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
    let apiResponse = openLinker("POST", url, "AT1601E07C17400008", JSON.stringify(body));
    let result = JSON.parse(apiResponse);
    result.data.data[0].email = currentUser.email;
    return result;
  }
}
exports({ entryPoint: MyAPIHandler });