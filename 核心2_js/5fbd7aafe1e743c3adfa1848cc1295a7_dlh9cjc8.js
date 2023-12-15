let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var yhtUserId = request.yhtUserId;
    let query_url = "http://localhost:8080/prmAdvisorCert/checkPrmAdvisorCert?yhtUserId=" + yhtUserId;
    let detail = postman("get", query_url, null, null);
    d = JSON.parse(detail);
    return detail;
  }
}
exports({ entryPoint: MyAPIHandler });