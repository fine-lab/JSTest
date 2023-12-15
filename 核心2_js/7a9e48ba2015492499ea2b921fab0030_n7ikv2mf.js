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
    var staffObj = JSON.parse(apiResponse);
    var id = staffObj.data.data[0].id;
    let dtUrl = "https://www.example.com/" + id;
    let dtResponse = openLinker("GET", dtUrl, "GT5258AT16", JSON.stringify({}));
    var staffDtObj = JSON.parse(dtResponse);
    return staffDtObj;
  }
}
exports({ entryPoint: MyAPIHandler });