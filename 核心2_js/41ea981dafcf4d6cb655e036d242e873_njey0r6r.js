let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var processBusinessKeyId = [request.billId];
    let body = { source: "RBSM", assignee: request.userId, processBusinessKeyIds: processBusinessKeyId };
    let url = "https://www.example.com/";
    let apiResponse = openLinker("POST", url, "GT99731AT2", JSON.stringify(body));
    return { apiResponse };
  }
}
exports({ entryPoint: MyAPIHandler });