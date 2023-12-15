let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let tenantId = "yourIdHere";
    let url = "https://www.example.com/" + tenantId;
    let header = { Accept: "application/json" };
    let apiResponse = postman("get", url, JSON.stringify(header), null);
    return { apiResponse };
  }
}
exports({ entryPoint: MyAPIHandler });