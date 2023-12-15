let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let body = {};
    let url = "https://www.example.com/" + request.id + "&orgId=" + request.orgId;
    let apiResponse = openLinker("GET", url, "CUST", JSON.stringify(body));
    return { apiResponse };
  }
}
exports({ entryPoint: MyAPIHandler });