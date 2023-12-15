let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var ythId = request.yhtUserId;
    var url = "http://localhost:8080/prmAdvisorCert/checkPrmAdvisorCert?yhtUserId=" + ythId;
    var strResponse = postman("get", url, null, null);
    return { strResponse };
  }
}
exports({ entryPoint: MyAPIHandler });