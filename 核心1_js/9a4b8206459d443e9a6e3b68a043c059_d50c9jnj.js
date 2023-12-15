let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var tenantId = JSON.parse(AppContext()).currentUser.tenantId;
    let url = "https://www.example.com/" + tenantId;
    let apiResponse = openLinker("GET", url, "GT37522AT1", JSON.stringify({}));
    return { apiResponse };
  }
}
exports({ entryPoint: MyAPIHandler });