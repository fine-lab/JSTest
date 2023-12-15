let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var orgId = request.orgId;
    let orgurl = "https://www.example.com/" + orgId;
    let orgResponse = openLinker("GET", orgurl, "ycContractManagement", JSON.stringify({}));
    var orgObj = JSON.parse(orgResponse).data;
    return orgObj;
  }
}
exports({ entryPoint: MyAPIHandler });