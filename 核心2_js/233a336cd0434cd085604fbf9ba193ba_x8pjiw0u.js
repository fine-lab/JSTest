let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let body = {};
    let url = "https://www.example.com/" + request.srcBill;
    let apiResponse = openLinker("GET", url, "ST", JSON.stringify(body));
    apiResponse = JSON.parse(apiResponse);
    return apiResponse.data;
  }
}
exports({ entryPoint: MyAPIHandler });